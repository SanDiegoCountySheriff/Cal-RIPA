module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ['<rootDir>/tests/unit/index.js'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.(js|vue)'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
}
