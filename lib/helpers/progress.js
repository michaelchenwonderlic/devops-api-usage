function ProgressHelper() {}

ProgressHelper.prototype.showProgress = function(numUpdated, numToUpdate, interval, message) {
  if (numUpdated % interval === 0 || numUpdated === numToUpdate) {
    console.log(`${message || ''}[Progress: ${Math.ceil((numUpdated / numToUpdate) * 100)}%]`);
  }
};

module.exports = new ProgressHelper();
