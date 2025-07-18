describe('services/log', () => {
  const mockSerializers = jest.fn()
  let mockStreams
  let mockBunyan
  const mockBuildConsoleStream = jest.fn()
  const mockBuildFileStream = jest.fn()

  beforeEach(() => {
    mockStreams = {
      buildConsoleStream: mockBuildConsoleStream,
      buildFileStream: mockBuildFileStream,
    }
    mockBunyan = {
      createLogger() {
        return {
          addStream: jest.fn(),
        }
      },
    }

    jest.mock('bunyan', () => mockBunyan)
    jest.mock('../../../app/services/log-serializers', () => mockSerializers)
    jest.mock('../../../app/services/log-streams', () => mockStreams)

    require('../../../app/services/log')
  })

  it('should add the mockBuildConsoleStream and mockBuildFileStream', () => {
    expect(mockBuildConsoleStream).toHaveBeenCalledTimes(1)
    expect(mockBuildFileStream).toHaveBeenCalledTimes(1)
  })
})
