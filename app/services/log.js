const bunyan = require('bunyan')
const serializers = require('./log-serializers')
const streams = require('./log-streams')

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

log.addStream(streams.buildConsoleStream())
log.addStream(streams.buildFileStream())

module.exports = log
