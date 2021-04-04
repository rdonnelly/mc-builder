module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'module:react-native-dotenv',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@api': './packages/mobile/src/api',
          '@components': './packages/mobile/src/components',
          '@context': './packages/mobile/src/context',
          '@data': './packages/mobile/src/data',
          '@hooks': './packages/mobile/src/hooks',
          '@navigation': './packages/mobile/src/navigation',
          '@screens': './packages/mobile/src/screens',
          '@shared': 'shared/src',
          '@store': './packages/mobile/src/store',
          '@styles': './packages/mobile/src/styles',
          '@utils': './packages/mobile/src/utils',
        },
      },
    ],
  ],
};
