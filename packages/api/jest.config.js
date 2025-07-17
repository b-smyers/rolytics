module.exports = {
  verbose: true,
  detectOpenHandles: true,
  testEnvironment: 'node',
  setupFiles: [
    './tests/jest.preSetup.js',
  ],
  setupFilesAfterEnv: [
    './tests/jest.postSetup.js',
  ],
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/$1',
    '@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '@middleware/(.*)': '<rootDir>/src/middleware/$1',
    '@models/(.*)': '<rootDir>/src/models/$1',
    '@routes/(.*)': '<rootDir>/src/routes/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@schemas/(.*)': '<rootDir>/src/schemas/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {},
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/tests/.*\\.js$",
  ],
}