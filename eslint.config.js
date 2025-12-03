// eslint-disable-next-line import/no-extraneous-dependencies
const hmppsConfig = require('@ministryofjustice/eslint-config-hmpps')

const config = hmppsConfig({
  extraIgnorePaths: ['app/assets/**/*.js', 'test/integration/**/*.js', 'test/cypress-e2e/**/*.js', 'cypress.config.js'],
  extraPathsAllowingDevDependencies: ['.allowed-scripts.mjs'],
})
config.push({
  rules: {
    'no-param-reassign': 'off',
    'global-require': 'off',
  },
})
config.push({
  languageOptions: {
    ecmaVersion: 2020,
  },
})

module.exports = config
