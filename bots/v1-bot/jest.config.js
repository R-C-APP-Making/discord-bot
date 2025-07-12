// bots/v1-bot/jest.config.js

/** @type {import('jest').Config} */
const aliases = require('module-alias-jest/register');

module.exports = {
  // 1. Run tests in a pure Node.js environment
  testEnvironment: 'node',

  // 2. Preload dotenv and alias mappings before tests
  setupFiles: [
    'dotenv/config', // runs require('dotenv').config()
    'module-alias-jest/register', // enables @src, @utils, etc.
  ],

  // 3. Map your package.json _moduleAliases into Jest’s resolver
  moduleNameMapper: aliases.jest, // uses the `jest` property of the imported object

  // 4. Discover test files anywhere named *.test.js or *.spec.js
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],

  // 5. Recognize these file extensions
  moduleFileExtensions: ['js', 'json', 'node'],

  // 6. Coverage output directory and targets
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],

  // 7. Verbose test reporting
  verbose: true,
};
