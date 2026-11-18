const assert = require('assert')
const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')
const config = require('../../config')

function validateLogLevel(level) {
  const validLogLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
  assert(validLogLevels.includes(level), `Invalid log level: '${logLevel}', valid options: '${validLogLevels}'`)
}

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logLevel = process.env.LOG_LEVEL || 'info'
const parsedLogLevel = logLevel.toLowerCase().trim()

validateLogLevel(parsedLogLevel)

const log = bunyan.createLogger({
  name: 'HwPV External',
  stream: formatOut,
  level: parsedLogLevel,
})

module.exports = log
