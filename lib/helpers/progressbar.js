function ProgressBar() {}

ProgressBar.prototype.showPercent = function(current, total, type, width = 60) {
  const finishedBlocksCount = Math.floor((current * width) / total);
  const waitingBlocksCount = width - finishedBlocksCount;
  const finishedBlocks = Array(finishedBlocksCount);
  finishedBlocks.fill('█');
  const waitingBlocks = Array(waitingBlocksCount);
  waitingBlocks.fill('_');
  const line = [...finishedBlocks, ...waitingBlocks].join('');
  const typePrint = type ? `[\u001b[33;1m${type}\u001b[0m] ` : '';
  process.stdout.write(
    `${typePrint}${line}  ${current} / ${total}, ${((current * 100) / total).toFixed(2)}%\r`
  );
};

module.exports = new ProgressBar();
