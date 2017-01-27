const merge = require('deepmerge')
const wdioConf = require('./wdio.conf')

exports.config = merge(wdioConf.config, {
  specs: ['./test/e2e-smoke/**/*.js'],
  services: ['sauce'],
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  baseUrl: process.env.SAUCE_BASEURL || 'http://localhost:3000',
  capabilities: [{
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '54.0'
  }]
})
