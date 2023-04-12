var async = require('asyncawait/async');
var await = require('asyncawait/await');

function HiringHelper() {}

HiringHelper.prototype.findAccountByMasterAccountId = async(function(db_hiring, masterAccountId, projection) {
  var query = {'masterAccountId': masterAccountId};
  var account = await(db_hiring.collection('accounts').find(query, projection).limit(1).next());
  if (!account) {
    throw new Error('Account not found: ' + masterAccountId);
  }
  return account;
});

module.exports = new HiringHelper();
