/** @format */

const execSync = require("child_process").execSync;

const lastCommitCommand = "git rev-parse HEAD";

module.exports = {
  async generateBuildId() {
    return execSync(lastCommitCommand).toString().trim();
  },
  trailingSlash: true,
  generateEtags: false,
  distDir: "dist",
  async headers() {
    return [
      {
        source: "/:path*{/}?",
        headers: [
          {
            key: "Cache-Control",
            value: 'no-cache="Set-Cookie"',
          },
        ],
      },
    ];
  },
};
