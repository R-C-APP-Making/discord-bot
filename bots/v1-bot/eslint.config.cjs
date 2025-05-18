// .eslintrc.cjs
const globals = require('globals');

module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  globals: {
    ...globals.node,
    // any other project-specific names
  },
  rules: {
    'prettier/prettier': ['error', { semi: true, singleQuote: true }],
    'no-console': 'warn',
    eqeqeq: 'error',
  },
};
