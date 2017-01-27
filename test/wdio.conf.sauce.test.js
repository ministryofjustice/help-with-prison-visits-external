const merge = require('deepmerge')
const wdioConf = require('./wdio.conf')

exports.config = merge(wdioConf.config, {
  services: ['sauce'],
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  baseUrl: process.env.EXT_WEB_TEST_BASEURL || 'http://localhost:3000',
  capabilities: [{
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '49.0'
  }]
})
