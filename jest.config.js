module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  transform: { "^.+\\.ts$": "ts-jest", "^.+\\.js$": "babel-jest" },
};
