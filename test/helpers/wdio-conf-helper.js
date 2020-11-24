const wdioConf = require('../wdio.conf')

module.exports = function (config) {
  const baseConfig = wdioConf.config
  for (const attrname in config) {
    baseConfig[attrname] = config[attrname]
  }

  return baseConfig
}
