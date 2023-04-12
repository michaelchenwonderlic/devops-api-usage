const runner = require('./lib/runner');
const ApiUsage = require('./lib/apiUsage/apiUsage');
const Confluence = require('./lib/confluence/confluence');
const Converters = require('./lib/apiUsage/converters');
const XlsxProcessor = require('./lib/xlsxProcessor');
const svgGenerator = require('./lib/apiUsage/svgGenerator');
const pngGenerator = require('./lib/apiUsage/pngGenerator');

const xlsxFileName = './xls/integrationapis.xlsx';

function updateSpreadSheet(fileName, tabName, rowData) {
  const processor = new XlsxProcessor(fileName);
  processor.updateSheet(tabName, rowData);
  processor.saveXlsx();
  return processor.getSheet(tabName);
}

async function main() {
  console.log('Start. ');
  console.log(' Obtaining apiUsage data...');
  const apiUsage = await ApiUsage.getApiUsage();

  const envForTabName = apiUsage.env;

  console.log(` Usage data obtained from ${envForTabName}!`);

  console.log(` Saving ${envForTabName} usage data to Xlsx...`);

  const usageForXlsx = Converters.usageToXlsJson(apiUsage);
  const fullUsageData = updateSpreadSheet(
    xlsxFileName,
    envForTabName,
    usageForXlsx
  );

  console.log(` Data saved to ${xlsxFileName} !`);

  console.log(` Publishing to confluence ...`);

  const contentToPublish = Converters.usageJsonToHtmlForPage(apiUsage);
  await Confluence.publishContent(contentToPublish);

  console.log(` Report published !`);

  console.log(` Building svg images ...`);
  const images = await svgGenerator.usageToCharts(
    Converters.usageToSvgFormat(fullUsageData),
    600,
    400
  );

  console.log(` Svg images built !`);

  console.log(` Convert to png images ...`);
  const convertedImages = await pngGenerator.imagesToPngHtml(images);
  const htmls = [];
  Object.keys(convertedImages).forEach((apiName) => {
    htmls.push(convertedImages[apiName].html);
  });

  const html = ` As of ${new Date()} <hr/> ${htmls.join('<hr/>')}`;

  console.log(` Images converted !`);
  console.log(` Publishing images ...`);
  await Confluence.publishContent({
    pageTitle: `Integration Usage Charts-${envForTabName}`,
    pageContent: html,
  });
  console.log(` Png images published`);

  console.log('Done!');
}

runner.run(main);
