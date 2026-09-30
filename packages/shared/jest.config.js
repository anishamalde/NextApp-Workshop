// The shared package has no React Native install of its own, so tests use the
// React Native (and React) that the Vega workspace installs.
const vegaNodeModules = '<rootDir>/../vega/node_modules';

module.exports = {
  preset: `${vegaNodeModules}/react-native`,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePaths: [vegaNodeModules],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@tanstack)/)',
  ],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testEnvironment: 'node',
};
