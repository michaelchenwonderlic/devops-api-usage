const runner = require('./lib/runner');
const XlsxProcessor = require('./lib/xlsxProcessor');
const svgGenerator = require('./lib/apiUsage/svgGenerator');
const converters = require('./lib/apiUsage/converters');
const confluence = require('./lib/confluence/confluence.js');
const pngGenerator = require('./lib/apiUsage/pngGenerator');

async function main() {
  const processor = new XlsxProcessor('./xls/integrationapis.xlsx');

  const usages = converters.usageToSvgFormat(processor.getSheet('prod'));

  const images = await svgGenerator.usageToCharts(usages, 600, 400);

  const updatedImages = await pngGenerator.imagesToPngHtml(images);
}

runner.run(main);
