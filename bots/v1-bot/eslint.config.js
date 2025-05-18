// eslint.config.js
const js = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  // 1) Core “recommended” JS rules
  js.configs.recommended,

  // 2) Add Node.js globals (console, process, __dirname, etc.)
  js.configs.node,

  // 3) Prettier integration + your overrides
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      // Pull in Prettier’s recommended rules:
      ...pluginPrettier.configs.recommended.rules,
      // Then override its core rule:
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],
      // Your custom ESLint rules:
      'no-console': 'warn',
      eqeqeq: 'error',
    },
    languageOptions: {
      ecmaVersion: 12, // ES2021
      sourceType: 'module', // import/export
    },
  },
];
