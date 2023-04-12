var Q = require('q');

function AsyncHelpers() {}

AsyncHelpers.prototype.sleep = function(ms) {
  return Q.Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
};

module.exports = new AsyncHelpers();