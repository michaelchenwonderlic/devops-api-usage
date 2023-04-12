const xlsx = require('xlsx');

const xlsParams = require('../xls/xlsxParam');

function XlsxProcessor(xlsxFileName) {
  this.xlsxFileName = xlsxFileName;
  this.data = {};
  this.workBook = xlsx.readFile(this.xlsxFileName);
  const sheets = this.workBook.SheetNames;

  sheets.forEach((sheet) => {
    this.data[sheet] = xlsx.utils.sheet_to_json(this.workBook.Sheets[sheet]);
  });
}

XlsxProcessor.prototype.getSheet = function (sheet) {
  return this.data[sheet];
};

XlsxProcessor.prototype.updateSheet = function (sheet, appendedData) {
  const existingSheet = this.data[sheet] || [];
  const sheetReadyToAppend = existingSheet.filter(
    (data) =>
      data[xlsParams.xlsxDateColumnName] !==
      appendedData[xlsParams.xlsxDateColumnName]
  );
  this.data[sheet] = [...sheetReadyToAppend, appendedData];
  return this.data[sheet];
};

XlsxProcessor.prototype.saveXlsx = function () {
  const newWorkBook = xlsx.utils.book_new();

  for (sheetName of Object.keys(this.data)) {
    xlsx.utils.book_append_sheet(
      newWorkBook,
      xlsx.utils.json_to_sheet(this.data[sheetName]),
      sheetName
    );
  }

  this.workBook = newWorkBook;

  xlsx.writeFile(this.workBook, `${this.xlsxFileName}`);
};
module.exports = XlsxProcessor;
