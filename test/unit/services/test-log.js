describe('services/log', function () {
  const mockSerializers = jest.fn()
  let mockStreams
  let mockBunyan
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
    jest.mock('../../../app/services/log-serializers', () => mockSerializers)
    jest.mock('../../../app/services/log-streams', () => mockStreams)

    require('../../../app/services/log')
  })

  it('should add the mockBuildConsoleStream and mockBuildFileStream', function () {
    expect(mockBuildConsoleStream).toHaveBeenCalledTimes(1)
    expect(mockBuildFileStream).toHaveBeenCalledTimes(1)
  })
})
