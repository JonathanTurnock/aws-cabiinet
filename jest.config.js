module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/echo-status"],
  testMatch: ["**/*.echo-status-service.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
