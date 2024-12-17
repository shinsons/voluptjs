import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    'rules': {
      'no-console': 0,
      'no-control-regex': 0,
      'indent': [
        'error',
        2
      ],
      'quotes': [
        2,
        'single'
      ],
      'linebreak-style': [
        2,
        'unix'
      ],
      'semi': [
        2,
        'always'
      ],
      'no-unused-vars': [
        'error',
        { 'argsIgnorePattern': 'next' }
      ]
    },
    'languageOptions': {
      'ecmaVersion': 2020,
      'sourceType': 'module',
      'globals': { ...globals.nodeBuiltin }
    },
    'ignores': ['node_modules/', 'deploy/', 'client/build/**']
  }];
