module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-constant-condition': 'off',
    'no-await-in-loop': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
    'no-return-await': 'off',
    'no-param-reassign': 'off',
    'no-template-curly-in-string': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-arrow-callback': 'error',
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  },
}
