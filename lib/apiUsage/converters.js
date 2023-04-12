const date = require('date-and-time');

const xlsParams = require('../../xls/xlsxParam');

function Converters() {}

Converters.prototype.usageJsonToHtml = function (usageData) {
  const htmlContent = [];
  htmlContent.push(
    `<p style="text-align: center;">From ${date.format(
      usageData.range.start,
      'MM/DD/YY'
    )} to ${date.format(usageData.range.end, 'MM/DD/YY')} (${
      usageData.env
    })</p><table data-layout="default" ac:local-id="1ba75d7e-bea7-46b4-a917-8e247faf622d"><colgroup><col style="width: 340.0px;" /><col style="width: 340.0px;" /></colgroup><tbody>`
  );
  htmlContent.push(
    '<tr><th><p style="text-align: center;"><strong>API Name</strong></p></th><th><p style="text-align: center;"><strong>Number of API Calls</strong></p></th></tr>'
  );
  for (api of usageData.usage) {
    htmlContent.push(
      `<tr><td><p>${api.apiName}</p></td><td><p>${
        api.accessCount === undefined ? 'N/A' : api.accessCount
      }</p></td></tr>`
    );
  }

  htmlContent.push(
    `</tbody></table><h6 style="text-align: right;"><em>Published by api pull tool ${date.format(
      new Date(),
      'MM/DD/YY HH:mm:ss Z'
    )}</em></h6><hr /><p />`
  );
  return htmlContent.join('\n');
};

Converters.prototype.usageJsonToHtmlForPage = function (usageData) {
  const pageContent = this.usageJsonToHtml(usageData);
  return {
    pageTitle: `From ${date.format(
      usageData.range.start,
      'MM/DD/YY'
    )} to ${date.format(usageData.range.end, 'MM/DD/YY')} (${usageData.env})`,
    pageContent,
  };
};

Converters.prototype.usageToXlsJson = function (usageData) {
  const title = `${date.format(
    usageData.range.start,
    'MM/DD/YY'
  )} to ${date.format(usageData.range.end, 'MM/DD/YY')}`;
  const data = {};
  data[xlsParams.xlsxDateColumnName] = title;
  usageData.usage.forEach((usage) => {
    data[usage.apiName] = usage.accessCount;
  });
  return data;
};

Converters.prototype.usageToSvgFormat = function (usageData) {
  const data = {};
  if (usageData[0]) {
    const apiNames = Object.keys(usageData[0]);
    apiNames.forEach((apiName) => {
      if (apiName === xlsParams.xlsxDateColumnName) {
        return;
      }
      const usageForThisApi = [];
      usageData.forEach((row) => {
        usageForThisApi.push({
          [xlsParams.xlsxDateColumnName]: row[xlsParams.xlsxDateColumnName],
          count: row[apiName],
        });
      });
      data[apiName] = usageForThisApi;
    });
  }
  return data;
};

module.exports = new Converters();
