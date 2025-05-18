// eslint.config.js
const js = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  // 1) Core ESLint rules
  js.configs.recommended,

  // 2) Prettier + custom rules + globals
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      // Manually expose console/process as globals:
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    plugins: { prettier: pluginPrettier },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],
      'no-console': 'warn',
      eqeqeq: 'error',
    },
  },
];
