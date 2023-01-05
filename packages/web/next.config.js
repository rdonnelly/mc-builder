/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: [
    '@mc-builder/shared',
    'styled-components/native',
    'react-native-render-html',
    'react-native-vector-icons',
  ],
  compiler: {
    styledComponents: true,
  },
  webpack: (config, options) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native-vector-icons/FontAwesome5Pro':
        'react-native-vector-icons/dist/FontAwesome5Pro',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    return config;
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cerebrodatastorage.blob.core.windows.net',
        pathname: '/cerebro-cards/official/*.jpg',
      },
    ],
  },
};

module.exports = nextConfig;
