/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: [],
  testMatch: ['**/__tests__/**/*.test.(js|jsx|ts|tsx)'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  verbose: true
};

module.exports = config;