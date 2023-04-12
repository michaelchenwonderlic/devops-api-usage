const moment = require('moment');
const _ = require('lodash');

function NewtonHelper() {}


NewtonHelper.prototype.calculateStatus = function(account) {
    const now = moment();
    const planType = _.get(account, 'plan.type');
    const dateOfCancellation = _.get(account, 'plan.dateOfCancellation');
    const dateOfNextRenewal = _.get(account, 'plan.dateOfNextRenewal');
    const dateOfTrialExpiration = _.get(account, 'plan.dateOfTrialExpiration');
  
    if (!planType || planType === 'No Plan') {
      return 'No Plan';
    } else if ((dateOfCancellation && now.isAfter(dateOfCancellation)) || (dateOfNextRenewal && now.isAfter(dateOfNextRenewal))) {
      return 'Cancelled';
    } else if (dateOfTrialExpiration && now.isAfter(dateOfTrialExpiration)) {
      return 'Expired';
    } else {
      return 'Active';
    }
  };
  
  NewtonHelper.prototype.calculateSubStatus = function(account) {
    const now = moment();
    const planStatus = _.get(account, 'plan.status');
    const dateOfCancellation = _.get(account, 'plan.dateOfCancellation');
  
    if (planStatus === 'Active' && account.plan.pendingRenewal) {
      return 'Pending Renewal';
    } else if (planStatus === 'Active' && dateOfCancellation && now.isBefore(dateOfCancellation)) {
      return 'Pending Cancellation';
    } else if (planStatus === 'Cancelled' && !dateOfCancellation) {
      return 'Failed Autorenew';
    } else {
      return null;
    }
  };

  module.exports = new NewtonHelper();