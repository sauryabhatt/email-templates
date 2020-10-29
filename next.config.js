/** @format */

const path = require("path");

module.exports = {
  distDir: "out",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    console.log(config);
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};
