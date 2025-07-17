const config = require('../../../config')

describe('services/log-streams', () => {
  let EXPECTED_LOG_LEVEL = config.LOGGING_LEVEL

  let logStreams
  const mockPrettyStream = jest.fn()

  beforeEach(() => {
    jest.mock('bunyan-prettystream', () => mockPrettyStream)

    logStreams = require('../../../app/services/log-streams')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('buildConsoleStream', () => {
    EXPECTED_LOG_LEVEL = 'DEBUG'

    it('should build and return the expected console stream', () => {
      mockPrettyStream.mockReturnValue({
        // pipe() {},
      })
      const stream = logStreams.buildConsoleStream()
      expect(mockPrettyStream).toHaveBeenCalledTimes(1)
      expect(stream.level).toBe(EXPECTED_LOG_LEVEL)
      expect(stream.stream).not.toBeNull()
    })
  })

  describe('buildFileStream', () => {
    const EXPECTED_TYPE = 'rotating-file'
    const EXPECTED_LOG_PATH = config.LOGGING_PATH || 'logs/external-web.log'
    const EXPECTED_PERIOD = '1d'
    const EXPECTED_COUNT = 7

    it('should build and return the expected file stream', () => {
      const stream = logStreams.buildFileStream()
      expect(stream.type).toBe(EXPECTED_TYPE)
      expect(stream.level).toBe(EXPECTED_LOG_LEVEL)
      expect(stream.path).toBe(EXPECTED_LOG_PATH)
      expect(stream.period).toBe(EXPECTED_PERIOD)
      expect(stream.count).toBe(EXPECTED_COUNT)
    })
  })
})
