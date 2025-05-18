// eslint.config.js
const js = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  // 1) ESLint’s built-in “recommended” JS rules
  js.configs.recommended,

  // 2) Prettier integration
  {
    // register the plugin under the “prettier” name
    plugins: { prettier: pluginPrettier },

    // spread in all of plugin-prettier’s recommended rules,
    // then override prettier/prettier with your inline opts
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],
      // your custom overrides:
      'no-console': 'warn',
      eqeqeq: 'error',
    },

    languageOptions: {
      env: {
        node: true, // enable Node.js global vars (require, module, console, etc.)
        es2021: true, // enable ES2021 globals like Promise
      },

      ecmaVersion: 12, // ES2021
      sourceType: 'module', // import/export
    },
  },
];
