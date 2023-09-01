module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: ['@react-native', 'prettier'],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  rules: {
    '@typescript-eslint/no-shadow': 'error',
    'no-shadow': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
  },
  overrides: [
    {
      files: '*',
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^\\u0000'],
              ['^@?\\w'],
              ['^'],
              [
                '^(@api|@components|@context|@data|@hooks|@navigation|@screens|@store|@styles|@utils)(/.*|$)',
              ],
              ['^(@mc-builder)(/.*|$)'],
              ['^\\.'],
            ],
          },
        ],
      },
    },
  ],
};
