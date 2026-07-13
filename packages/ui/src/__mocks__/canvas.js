// Stub for canvas native module (jsdom optional dep, can't build in CI)
// Must fully replace the canvas package so jsdom doesn't try to load native bindings.

const Canvas = function () {};
Canvas.prototype.getContext = () => ({
  fillRect: () => {},
  clearRect: () => {},
  getImageData: () => ({ data: [] }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  fillText: () => {},
  restore: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  stroke: () => {},
  translate: () => {},
  scale: () => {},
  rotate: () => {},
  arc: () => {},
  fill: () => {},
  measureText: () => ({ width: 0 }),
  transform: () => {},
  rect: () => {},
  clip: () => {},
});

module.exports = Canvas;
module.exports.createCanvas = () => new Canvas();
module.exports.loadImage = () => Promise.resolve(new Canvas());
module.exports.Canvas = Canvas;
module.exports.Image = Canvas;
module.exports.ImageData = function () {};
