// ── @hive-flow/ui — Jest configuration ──────────────────────────────

module.exports = {
  rootDir: 'src',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    resources: 'usable',
  },
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    'canvas': '<rootDir>/__mocks__/canvas.js',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
