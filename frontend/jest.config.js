module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/end_to_end/"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  collectCoverageFrom: [
    "app/Assets/components/**/*.{js,jsx,ts,tsx}", // specific needed target
    "**/*.{js,jsx,ts,tsx}", // general pattern
    "!**/node_modules/**",
    "!**/end_to_end/**",
    "!**/step_definitions/**",
    "!**/coverage/**",
    "!**/dist/**",
    "!**/*.config.js",
    "!**/.*",
  ],
};
