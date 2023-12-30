module.exports = {
  verbose: true,
  testRegex: ['.*\\.test\\.ts$', '.*\\.spec\\.ts$'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@config': '<rootDir>/src/config',
  },
  preset: 'ts-jest',
  testMatch: null,
  testEnvironment: 'node',
};
