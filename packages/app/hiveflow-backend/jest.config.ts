import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(pdf-parse|pdfjs-dist)/)',
  ],
};

export default config;
