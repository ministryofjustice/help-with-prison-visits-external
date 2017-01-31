const wdioConfHelper = require('./helpers/wdio-conf-helper')

exports.config = wdioConfHelper({
  specs: ['./test/e2e-smoke/**/*.js']
})
