module.exports = {
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/dist/**",
    "!**/*.config.js",
    "!**/.*",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
