var dbs = require('../../archive/lib/databases');

function AuthHelper() {}

AuthHelper.prototype.findUser = function(db_auth, searchCriteria) {
  var query = {'email': searchCriteria};
  if (dbs.ObjectID.isValid(searchCriteria)) {
    query = {_id: dbs.ObjectID(searchCriteria)};
  }
  return db_auth.collection('users').find(query).limit(1).next()
    .then(function(user) {
      if (!user) {
        throw new Error('User not found: ' + searchCriteria);
      }
      return user;
    });
};

module.exports = new AuthHelper();
