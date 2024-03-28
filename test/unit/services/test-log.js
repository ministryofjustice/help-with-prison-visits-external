describe('services/log', function () {
  const mockSerializers = jest.fn()
  const mockStreams = jest.fn()
  const mockBunyan = jest.fn()
  const mockBuildConsoleStream = jest.fn()
  const mockBuildFileStream = jest.fn()

  beforeEach(function () {
    mockStreams = {
      mockBuildConsoleStream,
      mockBuildFileStream
    }
    mockBunyan = {
      createLogger: function () {
        return {
          addStream: jest.fn()
        }
      }
    }

    jest.mock('bunyan', () => mockBunyan)
    jest.mock('./log-serializers', () => mockSerializers)
    jest.mock('./log-streams', () => mockStreams)

    require('../../../app/services/log')
  })

  it('should add the mockBuildConsoleStream and mockBuildFileStream', function () {
    expect(mockBuildConsoleStream).toHaveBeenCalledTimes(1)
    expect(mockBuildFileStream).toHaveBeenCalledTimes(1)
  })
})
