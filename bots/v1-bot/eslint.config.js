// eslint.config.js
const js = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');
const pluginNode = require('eslint-plugin-node');
const globals = require('globals');

module.exports = [
  // 1) Core ESLint recommended rules
  js.configs.recommended,

  // 2) Node.js-specific rules (deprecations, best practices)
  pluginNode.configs.recommended,

  // 3) Prettier integration + your overrides + globals
  {
    languageOptions: {
      ecmaVersion: 2021, // ES12
      sourceType: 'module', // allow import/export
      globals: {
        // bring in all standard Node.js globals (console, process, __dirname, etc.)
        ...globals.node,
        // if you use any additional custom globals, declare them here:
        // MY_GLOBAL: 'readonly',
      },
    },

    // register both plugins so we can reference their rules
    plugins: {
      prettier: pluginPrettier,
      node: pluginNode,
    },

    rules: {
      // Pull in all of eslint-plugin-prettier’s recommended rules,
      // then override prettier/prettier with your inline options:
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],

      // Your custom ESLint rules:
      'no-console': 'warn',
      eqeqeq: 'error',
    },
  },
];
