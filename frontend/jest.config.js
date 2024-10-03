module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/end_to_end/"],
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
};
