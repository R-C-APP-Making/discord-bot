// eslint.config.cjs
const js = require('@eslint/js');
const { flatConfig: nodeFlat } = require('eslint-plugin-node');
const prettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  nodeFlat.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],
      'no-console': 'warn',
      eqeqeq: 'error',
    },
  },
];
