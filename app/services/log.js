const config = require('../../config')
const bunyan = require('bunyan')
const bunyanLogstash = require('bunyan-logstash-tcp')
const PrettyStream = require('bunyan-prettystream')
const serializers = require('./log-serializers')

const logsPath = config.LOGGING_PATH || 'logs/external-web.log'
const logsLevel = config.LOGGING_LEVEL
const logstashHost = config.LOGSTASH_HOST
const logstashPort = config.LOGSTASH_PORT

// Stream to handle pretty printing of Bunyan logs to stdout.
var prettyStream = new PrettyStream()
prettyStream.pipe(process.stdout)

// Create a base logger for the application.
var log = bunyan.createLogger({
  name: 'external-web',
  streams: [],
  serializers: {
    'request': serializers.requestSerializer,
    'response': serializers.responseSerializer,
    'error': serializers.errorSerializer
  }
})

// Add stream to push logs to Logstash for aggregation, reattempt connections indefinitely.
if (logstashHost && logstashPort) {
  var logstashStream = bunyanLogstash.createStream({
    host: logstashHost,
    port: logstashPort,
    max_connect_retries: 10,
    retry_interval: 1000 * 60
  }).on('error', console.log)

  log.addStream({
    type: 'raw',
    level: logsLevel,
    stream: logstashStream
  })
}

// Add console Stream.
log.addStream({
  level: 'DEBUG',
  stream: prettyStream
})

// Add file stream.
log.addStream({
  type: 'rotating-file',
  level: logsLevel,
  path: logsPath,
  period: '1d',
  count: 7
})

module.exports = log
