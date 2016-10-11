var bunyan = require('bunyan')

// Create a base logger for the application.
var log = bunyan.createLogger({
  name: 'external-web',
  serializers: {
    'request': requestSerializer,
    'response': responseSerializer
  }
})

function requestSerializer (request) {
  return {
    url: request.url,
    method: request.method,
    params: request.params
  }
}

function responseSerializer (response) {
  return {
    statusCode: response.statusCode
  }
}

module.exports = log
