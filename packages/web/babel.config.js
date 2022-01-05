module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        alias: {
          '@shared': 'shared/src',
          '^react-native$': 'react-native-web',
        },
      },
    ],
    ['styled-components', { ssr: true, displayName: true, preprocess: false }],
    ['react-native-web', { commonjs: true }],
  ],
};
