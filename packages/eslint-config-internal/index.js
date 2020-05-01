/**
 * FAQ
 * IMPORTANT: prettier rules should be last. Because prettier override some stylistic rules.
 */

module.exports = {
  extends: [
    'airbnb-base',
    ...[
      './rules/best-practices',
      './rules/errors',
      './rules/es6',
      './rules/flowtype',
      './rules/imports',
      './rules/react',
      './rules/react-hooks',
      './rules/style',
      './rules/variables',
      './rules/prettier',
    ].map(require.resolve),
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
    es2020: true,
  },
  globals: {
    _: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 11,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  rules: {},
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'global-require': 'off',
        'no-magic-numbers': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/*{types,Types}/**.js', 'types.js'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
