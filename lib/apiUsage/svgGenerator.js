const SVG = require('svg-builder');

const xlsParams = require('../../xls/xlsxParam');
function baseLines(svg, title, width, height, chartData) {
  const numberOfDates = chartData.length;
  svg
    .text(
      {
        x: 10,
        y: 20,
        'font-family': 'helvetica',
        'font-size': 12,
        stroke: '#000',
        fill: '#000',
      },
      title
    )
    .line({
      x1: 10,
      y1: 30,
      x2: 10,
      y2: height + 30,
      stroke: '#000',
      'storke-width': 2,
    })
    .line({
      x1: 10,
      y1: height + 30,
      x2: width + 30,
      y2: height + 30,
      stroke: '#000',
      'storke-width': 2,
    })
    .text(
      {
        x: 5,
        y: height + 40,
        'font-family': 'Times',
        'font-size': 8,
        fill: '#000',
        translate: (100, 100),
      },
      xlsParams.xlsxDateColumnName
    );
  const dateGap = Math.floor(width / numberOfDates);

  for (let count = 1; count <= numberOfDates; count += 1) {
    const tick = chartData[count - 1][xlsParams.xlsxDateColumnName].slice(0, 8);
    svg
      .line({
        x1: dateGap * count + 10,
        y1: 30,
        x2: dateGap * count + 10,
        y2: height + 30,
        stroke: '#eee',
        'stroke-width': 1,
      })
      .text(
        {
          x: dateGap * count - 5,
          y: height + 40,
          'font-family': 'Times',
          'font-size': 8,
          fill: '#000',
        },
        tick
      );
  }
  return dateGap;
}

function addCountLines(svg, maxNumber, width, height) {
  const lineDivision = maxNumber
    ? Math.pow(10, Math.floor(Math.log10(maxNumber)))
    : 10;
  const ceiling = Math.ceil(maxNumber / lineDivision) * lineDivision;
  const lineGap = Math.floor((height * lineDivision) / ceiling);

  for (let count = lineDivision; count <= ceiling; count += lineDivision) {
    svg
      .line({
        x1: 10,
        y1: height + 30 - (lineGap * count) / lineDivision,
        x2: width + 30,
        y2: height + 30 - (lineGap * count) / lineDivision,
        stroke: '#eee',
        'stroke-width': 1,
      })
      .text(
        {
          x: 10,
          y: height + 30 - (lineGap * count) / lineDivision,
          'font-family': 'Times',
          'font-size': 10,
          fill: '#000',
        },
        `${count}`
      );
  }

  return [lineGap, lineDivision];
}

function addData(
  svg,
  dateLineGap,
  countLineGap,
  countLineDivision,
  height,
  chartData
) {
  chartData.forEach((_row, index) => {
    if (index) {
      svg.line({
        x1: dateLineGap * index + 10,
        y1:
          height +
          30 -
          Math.floor(
            (chartData[index - 1].count * countLineGap) / countLineDivision
          ),
        x2: dateLineGap * (index + 1) + 10,
        y2:
          height +
          30 -
          Math.floor(
            (chartData[index].count * countLineGap) / countLineDivision
          ),
        stroke: 'red',
        'stroke-width': 2,
      });
    }
    svg.text(
      {
        x: dateLineGap * (index + 1) + 10,
        y:
          height +
          30 -
          Math.floor(
            (chartData[index].count * countLineGap) / countLineDivision
          ),
        'font-family': 'Times',
        'font-size': 10,
        fill: '#000',
      },
      `${chartData[index].count}`
    );
  });
}

function usageToChartIndividual(usageData, apiName, width, height) {
  const chartData = usageData[apiName];
  const svg = SVG.width(width + 30).height(height + 50);
  svg.reset();
  const dateLineGap = baseLines(
    svg,
    `${apiName} usage`,
    width,
    height,
    chartData
  );
  const max = Math.max(...chartData.map((line) => line.count));
  const [countLineGap, countLineDivision] = addCountLines(
    svg,
    max,
    width,
    height
  );
  addData(svg, dateLineGap, countLineGap, countLineDivision, height, chartData);
  return svg.render();
}

function SvgGenerator() {}

SvgGenerator.prototype.usageToCharts = async (usageData, width, height) => {
  const images = {};
  const apiNames = Object.keys(usageData);

  for (apiName of apiNames) {
    const svg = usageToChartIndividual(usageData, apiName, width, height);
    images[apiName] = { svg };
  }

  return images;
};

module.exports = new SvgGenerator();
