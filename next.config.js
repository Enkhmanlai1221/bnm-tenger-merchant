/** @type {import('next').NextConfig} */

const isDevelopment = process.env.NODE_ENV !== "production";
const rewritesConfig = isDevelopment
  ? [{ source: "/rest/:path*", destination: "/api/:path*" }]
  : [{ source: "/rest/:path*", destination: "/api/:path*" }];

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizeCss: true,
    workerThreads: true,
    optimizePackageImports: [
      "@headlessui/react",
      "@heroui/react",
      "react-select",
      "react-hook-form",
      "@tabler/icons-react",
      "framer-motion",
      "react-scroll",
      "react-map-gl",
      "mapbox-gl",
    ],
  },
  output: "standalone",
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.amicusmongolia.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev-goodtech.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gerbook.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: process.env.NODE_ENV !== "production",
  },
  webpack: (config, { dev, isServer }) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    config.ignoreWarnings = [
      { module: /node_modules\/node-fetch\/lib\/index\.js/ },
      { module: /node_modules\/punycode\/punycode\.js/ },
    ];

    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          styles: {
            name: "styles",
            test: /\.(css|scss)$/,
            chunks: "all",
            enforce: true,
          },
        },
      };
    }

    return config;
  },
  optimizeFonts: true,
  swcMinify: true,
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production",
  // },
  rewrites: async () => rewritesConfig,
};

module.exports = withBundleAnalyzer(nextConfig);
