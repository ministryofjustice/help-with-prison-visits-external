const config = require('../../config')
const bunyan = require('bunyan')
const serializers = require('./log-serializers')
const streams = require('./log-streams')

const LOGSTASH_HOST = config.LOGSTASH_HOST
const LOGSTASH_PORT = config.LOGSTASH_PORT

// Create a base logger for the application.
var log = bunyan.createLogger({
  name: 'external-web',
  streams: [],
  serializers: {
    request: serializers.requestSerializer,
    response: serializers.responseSerializer,
    error: serializers.errorSerializer
  }
})

if (LOGSTASH_HOST && LOGSTASH_PORT) {
  log.addStream(streams.buildLogstashStream())
}
log.addStream(streams.buildConsoleStream())
log.addStream(streams.buildFileStream())

module.exports = log
