/** @format */

const path = require("path");

module.exports = {
  distDir: "out",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  experimental: {
    async redirects() {
      return [{ source: "/", destination: "/home", permanent: true }];
    },
  },
};
