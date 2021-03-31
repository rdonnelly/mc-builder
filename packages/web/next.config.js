const withTM = require('next-transpile-modules')([
  'react-native-haptic-feedback',
  'react-native-render-html',
  'react-native-vector-icons',
  'styled-components',
  'shared',
]);

module.exports = withTM({
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
});
