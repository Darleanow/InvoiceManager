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
    "!server.js", // main entry of the program, all it does is calling a sql connection, hence unrelevant for the coverage
  ],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
