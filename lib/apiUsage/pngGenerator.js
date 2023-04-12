const svgToPng = require('convert-svg-to-png');

function PngGenerator() {}

PngGenerator.prototype.convertSvgToPng = async function (svg) {
  return await svgToPng.convert(svg, { background: '#FFF' });
};

PngGenerator.prototype.imagesToPngHtml = async function (images) {
  for (apiName of Object.keys(images)) {
    console.log(`  ... converting image for ${apiName} ...`);
    images[apiName].png = (
      await this.convertSvgToPng(images[apiName].svg)
    ).toString('base64');
    images[
      apiName
    ].html = `<img width="630" src="data:image/png;base64,${images[apiName].png}" />`;
  }
  return images;
};

module.exports = new PngGenerator();
