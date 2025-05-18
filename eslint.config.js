// eslint.config.js
const js = require('@eslint/js');

module.exports = [
  // 1) Core “recommended” rules from the ESLint team
  js.configs.recommended,

  // 2) Your custom overrides + Prettier integration
  {
    // Pull in the “plugin:prettier/recommended” preset
    extends: ['plugin:prettier/recommended'],

    languageOptions: {
      ecmaVersion: 12,       // ES2021
      sourceType: 'module',  // allow import/export
    },

    rules: {
      // Treat Prettier violations as errors, and override two options:
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],

      // Custom ESLint rules
      'no-console': 'warn',
      'eqeqeq': 'error',
    },
  },
];