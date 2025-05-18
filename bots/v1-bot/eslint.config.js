// eslint.config.js
const js = require('@eslint/js');
const pluginNode = require('eslint-plugin-node');
const pluginPrettier = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = [
  // 1) Core ESLint “recommended” rules
  js.configs.recommended,

  // 2) Node.js best practices (deprecated APIs, callback patterns)
  pluginNode.configs.recommended,

  // 3) Prettier integration + custom rules + globals
  {
    languageOptions: {
      ecmaVersion: 2021, // ES12 syntax support
      sourceType: 'module', // enable import/export
      globals: {
        // pull in all standard Node.js env globals (console, process, __dirname, etc.)
        ...globals.node,
        // add any additional project-specific globals here:
        // MY_CUSTOM_GLOBAL: 'readonly',
      },
    },
    plugins: {
      node: pluginNode,
      prettier: pluginPrettier,
    },
    rules: {
      // enforce Prettier formatting as ESLint errors
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],

      // your custom code-quality rules
      'no-console': 'warn',
      eqeqeq: 'error',
    },
  },
];
