module.exports = {
  testEnvironment: 'node',
  verbose: true,
  roots: ['<rootDir>/tests/integration'],
  testMatch: [
    '**/tests/integration/**/*.spec.js',
    '**/tests/integration/**/*.test.js'
  ],
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: false,
  testTimeout: 10000,
  // バンドル後のファイルをテストするため、transformは不要
  transform: {},
  // モジュール解決の設定
  moduleNameMapper: {},
  // グローバル設定
  globals: {}
};
