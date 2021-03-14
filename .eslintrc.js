module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'sort-imports-es6-autofix'],
  extends: [
    '@react-native-community',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
      },
    ],
    'sort-imports-es6-autofix/sort-imports-es6': [
      'error',
      {
        ignoreCase: false,
        ignoreMemberSort: true,
        memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
      },
    ],
  },
};
