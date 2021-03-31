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
        },
      },
    ],
    ['react-native-web', { commonjs: true }],
    ['styled-components', { ssr: true }],
  ],
};
