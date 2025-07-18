const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: 'test/cypress-e2e/fixtures',
  screenshotsFolder: 'test/cypress-e2e/screenshots',
  videosFolder: 'test/cypress-e2e/videos',
  viewportWidth: 1200,
  viewportHeight: 1400,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./test/cypress-e2e/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'test/cypress-e2e/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'test/cypress-e2e/support/index.js',
  },
})
