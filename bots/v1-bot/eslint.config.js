// bots/v1-bot/eslint.config.js

const js = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');
const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');

module.exports = [
  // 1) ESLint’s built-in “recommended” JS rules
  js.configs.recommended,

  // 2) Your main project rules + Prettier + Node globals
  {
    plugins: {
      prettier: pluginPrettier,
    },

    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],
      'no-console': 'warn',
      eqeqeq: 'error',
    },

    languageOptions: {
      parserOptions: {
        ecmaVersion: 12, // ES2021 syntax
        sourceType: 'module',
      },
      // <-- enable Node & ES2021 built-ins here
      globals: {
        ...globals.node, // require, module, console, process, __dirname, etc.
        ...globals.es2021, // Promise, etc.
      },
    },

    settings: {
      // 3) Tell eslint-plugin-import how to resolve your `_moduleAliases`
      'import/resolver': {
        alias: {
          map: [
            ['@src', './src'],
            ['@commands', './src/commands'],
            ['@events', './src/events'],
            ['@utils', './src/utils'],
          ],
          extensions: ['.js', '.json', '.node'],
        },
      },
    },
  },

  // 4) Override for test files: enable Jest globals + rules
  {
    files: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      env: {
        jest: true,
      },
    },
    // 8) Apply the plugin’s recommended best-practices rules
    ...jestPlugin.configs['flat/recommended'],
  },
];
