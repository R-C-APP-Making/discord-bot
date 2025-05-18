// eslint.config.js
const js = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = [
  // 1) ESLint’s built-in “recommended” JS rules
  js.configs.recommended,

  // 2) Your Prettier + custom rules, plus Node globals
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],
      'no-console': 'warn',
      eqeqeq: 'error',
    },

    languageOptions: {
      parserOptions: {
        ecmaVersion: 12, // ES2021 syntax
        sourceType: 'module', // if you ever use import/exports
      },

      // <-- enable Node & ES2021 built-ins here
      globals: {
        ...globals.node, // require, module, console, process, __dirname, etc.
        ...globals.es2021, // Promise, etc.
      },
    },
  },
];
