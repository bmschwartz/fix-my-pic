/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['mui-file-input'],
  webpack: (config, { isServer }) => {
    // Add custom file loader for .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'file-loader',
    });

    return config;
  },
}

module.exports = nextConfig;
