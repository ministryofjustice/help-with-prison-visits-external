const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')
const config = require('../../config')

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.PRODUCTION })

const log = bunyan.createLogger({ name: 'HwPV Internal', stream: formatOut, level: 'debug' })

module.exports = log
