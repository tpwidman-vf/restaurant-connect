// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
// eslint-disable-next-line no-undef
export default {
    clearMocks: true,
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', 'dist'],
    // setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
    coverageDirectory: 'coverage',
    moduleFileExtensions: [
      'js',
      //   "json",
      //   "jsx",
      'ts',
      //   "tsx",
      //   "node"
    ],
    testEnvironment: 'node',
    verbose: true,
  };
  