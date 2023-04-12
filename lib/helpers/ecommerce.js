const async = require('asyncawait/async');
const await = require('asyncawait/await');
const moment = require('moment-timezone');
const _ = require('lodash');
const timezone = 'America/Chicago';

const dbs = require('../../archive/lib/databases');

function EcommerceHelper() {}

EcommerceHelper.prototype.getMasterAccountById = async(function(db_ecommerce, masterAccountId, projection) {
  if (!masterAccountId) {
    throw new Error('masterAccountId is required');
  }
  let masterAccount = await(db_ecommerce.collection('masterAccounts').getOneById(masterAccountId, projection));
  if (!masterAccount) {
    throw new Error(`Master account with id ${masterAccountId} not found`);
  }
  return masterAccount;
});

EcommerceHelper.prototype.findMasterAccount = async(function(db_ecommerce, searchCriteria, projection) {
  let query = {'netsuite.displayId': searchCriteria};
  if (dbs.ObjectID.isValid(searchCriteria)) {
    query = {_id: dbs.ObjectID(searchCriteria)};
  }
  const masterAccount = await(db_ecommerce.collection('masterAccounts').find(query, projection).limit(1).next());
  if (!masterAccount) {
    throw new Error('Master Account not found: ' + searchCriteria);
  }
  return masterAccount;
});

EcommerceHelper.prototype.enqueueStatusRefresh = function(db_ecommerce, masterAccountId, nextReceivableTime, logger, liveRun) {
  let time = 'now';
  const doc = {
    type: 'masterAccount.refreshStatuses',
    message: {
      masterAccountId: masterAccountId
    }
  };
  if (nextReceivableTime) {
    doc.nextReceivableTime = nextReceivableTime;
    time = moment(nextReceivableTime).format('YYYY-MM-DD hh:mm:ss A');
  }

  logger.logLineBoth(`${liveRun ? '[Live Run] ' : '[Test Run] '}Enqueued masterAccount.refreshStatuses queue message for masterAccountId: ${masterAccountId} with pickup time: ${time}`);
  if (liveRun) {
    return db_ecommerce.collection('_queue').insertOne(doc);
  }
};

EcommerceHelper.prototype.calculateHiringStatus = (masterAccount) => {
  const now = moment();
  const planType = _.get(masterAccount, 'hiring.plan.type');
  const dateOfSuspension = _.get(masterAccount, 'hiring.dateOfSuspension');
  const dateOfTrialExpiration = _.get(masterAccount, 'hiring.dateOfTrialExpiration');
  const dateOfGracePeriodExpiration = _.get(masterAccount, 'hiring.dateOfGracePeriodExpiration');
  const dateOfCancellation = _.get(masterAccount, 'hiring.dateOfCancellation');
  const hasPendingNetsuiteTransaction = _.find(masterAccount.purchases, {transactionId: 'Pending'});

  if (!planType) {
    return 'No Plan';
  } else if (planType === 'Trial') {
    if (now.isBefore(dateOfTrialExpiration)) {
      return 'Active';
    } else {
      return 'Expired';
    }
  } else if (dateOfCancellation && now.isAfter(dateOfCancellation) && !hasPendingNetsuiteTransaction) {
    return 'Cancelled';
  } else if (now.isBefore(dateOfSuspension) || hasPendingNetsuiteTransaction) { // allow user into WonScore temporarily while their payment processes
    return 'Active';
  } else if (now.isBefore(dateOfGracePeriodExpiration)) {
    return 'On Hold';
  } else {
    return 'Cancelled';
  }
};

EcommerceHelper.prototype.setTime = (dateTime, hour, minute, second, millisecond) => {
  return moment(dateTime).tz(timezone).hour(hour || 0).minute(minute || 0).second(second || 0).millisecond(millisecond || 0).toDate();
};

EcommerceHelper.prototype.calculateHiringSubStatus = (masterAccount, status) => {
  const now = moment();
  const isTrial = _.get(masterAccount, 'hiring.plan.type') === 'Trial';
  const paymentType = _.get(masterAccount, 'payment.type');
  const dateOfInvoicePaymentPending = _.get(masterAccount, 'hiring.dateOfInvoicePaymentPending');
  const dateOfInvoicePaymentPastDue = _.get(masterAccount, 'hiring.dateOfInvoicePaymentPastDue');
  const dateOfGracePeriodExpiration = _.get(masterAccount, 'hiring.dateOfGracePeriodExpiration');
  const dateOfCancellation = _.get(masterAccount, 'hiring.dateOfCancellation');
  const dateOfPause = _.get(masterAccount, 'hiring.dateOfPause');
  const isPendingCancellation = dateOfCancellation && now.isBefore(dateOfCancellation);
  const isPendingPause = dateOfPause && now.isBefore(dateOfPause);
  const isPaused = dateOfPause && now.isAfter(dateOfPause);
  const hasPendingNetsuiteTransaction = _.find(masterAccount.purchases, {transactionId: 'Pending'});
  const hasFailedNetsuiteTransaction = _.find(masterAccount.purchases, {transactionId: 'Transaction Failed'});

  if (isTrial || _.includes(['No Plan', 'Cancelled'], status)) {
    return;
  } else if (paymentType === 'creditCard') {
    if (status === 'On Hold' || _.get(masterAccount, 'payment.creditCard.isFailed')) {
      return 'Failed Billing';
    } else if (isPendingCancellation) {
      return 'Pending Cancellation';
    } else if (isPendingPause) {
      return 'Pending Pause';
    } else if (isPaused) {
      return 'Paused';
    } else if (hasPendingNetsuiteTransaction) {
      return 'Pending Payment';
    }
  } else if (paymentType === 'invoice') {
    if (isPendingCancellation) {
      return 'Pending Cancellation';
    } else if (hasFailedNetsuiteTransaction) {
      return 'Failed Billing';
    } else if ((now.isAfter(dateOfInvoicePaymentPending) && now.isBefore(dateOfInvoicePaymentPastDue)) || hasPendingNetsuiteTransaction) {
      return 'Pending Payment';
    } else if (now.isAfter(dateOfInvoicePaymentPastDue) && now.isBefore(dateOfGracePeriodExpiration)) {
      return 'Past Due';
    }
  } else if (paymentType === 'partner') {
    if (isPendingCancellation) {
      return 'Pending Cancellation';
    } else if (hasPendingNetsuiteTransaction) {
      return 'Pending Payment';
    } else if (hasFailedNetsuiteTransaction) {
      return 'Failed Billing';
    }
  }
};

module.exports = new EcommerceHelper();