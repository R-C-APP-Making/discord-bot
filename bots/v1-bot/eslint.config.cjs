// eslint.config.js
import js from '@eslint/js';
import { flatConfig as nodeFlat } from 'eslint-plugin-node'; // note: flat-config entrypoint
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  // core “recommended” for JS
  js.configs.recommended,

  // Node-plugin’s flat-config version
  nodeFlat.recommended,

  // your own overrides
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
        // any additional globals
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],
      'no-console': 'warn',
      eqeqeq: 'error',
    },
  },
];
