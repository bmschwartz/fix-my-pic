/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'white-giant-rooster-133.mypinata.cloud',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Add custom file loader for .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'file-loader',
    });

    return config;
  },
};

module.exports = nextConfig;
