export default {
  collectCoverageFrom: ['app/**/*.{ts,js,jsx,mjs}'],
  testPathIgnorePatterns: ['<rootDir>/test/unit/routes/mock-view-engine.js'],
  testMatch: ['<rootDir>/test/unit/**/?(*.){ts,js,jsx,mjs}'],
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test_results/jest/',
      },
    ],
    [
      './node_modules/jest-html-reporter',
      {
        outputPath: 'test_results/unit-test-reports.html',
      },
    ],
  ],
  moduleFileExtensions: ['web.js', 'js', 'json', 'node', 'ts'],
}
