/** @type {import('next').NextConfig} */
const nextConfig = {
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
  experimental: {
    outputFileTracingIncludes: {
      '/api/watermark': ['./public/watermark.png'],
    },
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
