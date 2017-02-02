const config = require('../../config')
const PrettyStream = require('bunyan-prettystream')
const bunyanLogstash = require('bunyan-logstash-tcp')

const LOG_LEVEL = config.LOGGING_LEVEL
const LOG_PATH = config.LOGGING_PATH || 'logs/external-web.log'

const LOGSTASH_HOST = config.LOGSTASH_HOST
const LOGSTASH_PORT = config.LOGSTASH_PORT

module.exports.buildLogstashStream = function () {
  var logstashStream = bunyanLogstash.createStream({
    host: LOGSTASH_HOST,
    port: LOGSTASH_PORT,
    max_connect_retries: 10,
    retry_interval: 1000 * 60
  }).on('error', console.log)

  return {
    type: 'raw',
    level: LOG_LEVEL,
    stream: logstashStream
  }
}

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
