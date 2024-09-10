module.exports = {
  preset: "ts-jest",
  testFailureExitCode: 0,
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@lib/?(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ["cobertura", "text-summary"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
};
