// eslint.config.js
const js = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  // 1) ESLint’s built-in “recommended” JS rules
  js.configs.recommended,

  // 2) Prettier integration + your custom rules
  {
    // Tell ESLint which globals to provide
    environment: {
      node: true, // defines `process`, `console`, etc.
      browser: false, // set to true if this code also runs in browsers
      es2021: true, // enables ES12 globals like Promise.allSettled
    },

    // Register Prettier as a plugin
    plugins: { prettier: pluginPrettier },

    // Pull in all the plugin-prettier “recommended” rules,
    // then override the prettier/prettier rule and add yours:
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],
      'no-console': 'warn',
      eqeqeq: 'error',
    },

    // Parsing options
    languageOptions: {
      ecmaVersion: 12, // ES2021
      sourceType: 'module', // enable import/export
    },
  },
];
