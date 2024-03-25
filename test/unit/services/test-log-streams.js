const sinon = require('sinon')
const config = require('../../../config')

jest.mock('bunyan-prettystream', () => prettyStreamStub)

describe('services/log-streams', function () {
  const EXPECTED_LOG_LEVEL = config.LOGGING_LEVEL

  let logStreams
  let prettyStreamStub

  beforeEach(function () {
    prettyStreamStub = sinon.stub()

    logStreams = require('../../../app/services/log-streams')
  })

  describe('buildConsoleStream', function () {
    const EXPECTED_LOG_LEVEL = 'DEBUG'

    it('should build and return the expected console stream', function () {
      prettyStreamStub.returns({
        pipe: function () {}
      })
      const stream = logStreams.buildConsoleStream()
      sinon.toHaveBeenCalledTimes(1)
      expect(stream.level).toBe(EXPECTED_LOG_LEVEL)
      expect(stream.stream).not.toBeNull()
    })
  })

  describe('buildFileStream', function () {
    const EXPECTED_TYPE = 'rotating-file'
    const EXPECTED_LOG_PATH = config.LOGGING_PATH || 'logs/external-web.log'
    const EXPECTED_PERIOD = '1d'
    const EXPECTED_COUNT = 7

    it('should build and return the expected file stream', function () {
      const stream = logStreams.buildFileStream()
      expect(stream.type).toBe(EXPECTED_TYPE)
      expect(stream.level).toBe(EXPECTED_LOG_LEVEL)
      expect(stream.path).toBe(EXPECTED_LOG_PATH)
      expect(stream.period).toBe(EXPECTED_PERIOD)
      expect(stream.count).toBe(EXPECTED_COUNT)
    })
  })
})
