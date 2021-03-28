module.exports = {
  presets: ['next/babel'],
  plugins: [
    // ['styled-components', { ssr: true }],
    ['react-native-web', { commonjs: true }],
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
  ],
};
