// Prevent jsdom from trying to load the native canvas module.
// This must run before any test environment is set up.

jest.mock('canvas', () => {
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
  return {
    createCanvas: () => new Canvas(),
    loadImage: () => Promise.resolve(new Canvas()),
    Canvas,
    Image: Canvas,
    ImageData: function () {},
  };
}, { virtual: true });
