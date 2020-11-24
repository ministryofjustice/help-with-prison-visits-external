const config = require('../../config')
const PrettyStream = require('bunyan-prettystream')

const LOG_LEVEL = config.LOGGING_LEVEL
const LOG_PATH = config.LOGGING_PATH || 'logs/external-web.log'

module.exports.buildConsoleStream = function () {
  var prettyStream = new PrettyStream()
  prettyStream.pipe(process.stdout)

  return {
    level: 'DEBUG',
    stream: prettyStream
  }
}

module.exports.buildFileStream = function () {
  return {
    type: 'rotating-file',
    level: LOG_LEVEL,
    path: LOG_PATH,
    period: '1d',
    count: 7
  }
}
