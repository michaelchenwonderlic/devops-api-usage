const xlsx = require('node-xlsx');

function XlsxParser() {}

XlsxParser.prototype.parseToObject = function (filename) {
  const sheets = xlsx.parse(filename);

  const objToReturn = {};
  sheets.forEach((sheet) => {
    const sheetData = sheet.data;
    const header = sheetData[0];
    const data = sheetData.slice(1);
    const result = [];
    data.forEach((dataLine) => {
      const res = {};
      for (let i = 0; i < header.length; i++) {
        res[header[i]] = dataLine[i];
      }
      result.push(res);
    });
    objToReturn[sheet.name] = result;
  });
  return objToReturn;
};

module.exports = new XlsxParser();
