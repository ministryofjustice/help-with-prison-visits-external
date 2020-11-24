const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const config = require('../../../config')

describe('services/log-streams', function () {
  const EXPECTED_LOG_LEVEL = config.LOGGING_LEVEL

  var logStreams
  var prettyStreamStub
  var bunyanLogstashTcpStub

  beforeEach(function () {
    prettyStreamStub = sinon.stub()
    bunyanLogstashTcpStub = sinon.stub()

    logStreams = proxyquire('../../../app/services/log-streams', {
      'bunyan-prettystream': prettyStreamStub,
      'bunyan-logstash-tcp': bunyanLogstashTcpStub
    })
  })

  describe('buildConsoleStream', function () {
    const EXPECTED_LOG_LEVEL = 'DEBUG'

    it('should build and return the expected console stream', function () {
      prettyStreamStub.returns({
        pipe: function () {}
      })
      var stream = logStreams.buildConsoleStream()
      sinon.assert.calledOnce(prettyStreamStub)
      expect(stream.level).to.equal(EXPECTED_LOG_LEVEL)
      expect(stream.stream).to.not.equal(null)
    })
  })

  describe('buildFileStream', function () {
    const EXPECTED_TYPE = 'rotating-file'
    const EXPECTED_LOG_PATH = config.LOGGING_PATH || 'logs/external-web.log'
    const EXPECTED_PERIOD = '1d'
    const EXPECTED_COUNT = 7

    it('should build and return the expected file stream', function () {
      var stream = logStreams.buildFileStream()
      expect(stream.type).to.equal(EXPECTED_TYPE)
      expect(stream.level).to.equal(EXPECTED_LOG_LEVEL)
      expect(stream.path).to.equal(EXPECTED_LOG_PATH)
      expect(stream.period).to.equal(EXPECTED_PERIOD)
      expect(stream.count).to.equal(EXPECTED_COUNT)
    })
  })
})
