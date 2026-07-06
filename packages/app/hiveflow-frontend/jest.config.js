module.exports = {
  rootDir: "src",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "single-spa-react/parcel": "single-spa-react/lib/cjs/parcel.cjs",
    "^canvas$": "<rootDir>/__mocks__/canvas.js",
    "^canvas/.+$": "<rootDir>/__mocks__/canvas.js",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
