// Custom Jest resolver — stubs the `canvas` module so jsdom doesn't
// try to load its missing native binary.

const path = require('path');

module.exports = (request, options) => {
  // Intercept canvas and all its subpaths
  if (request === 'canvas' || request.startsWith('canvas/') || request.startsWith('canvas\\')) {
    return path.resolve(__dirname, 'src', '__mocks__', 'canvas.js');
  }

  // Fall back to Jest's default resolver
  return options.defaultResolver(request, options);
};
