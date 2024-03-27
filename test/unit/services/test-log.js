const sinon = require('sinon')

jest.mock(bunyan, () => bunyanStub)
jest.mock('./log-serializers', () => serializersStub)
jest.mock('./log-streams', () => streamsStub)

describe('services/log', function () {
  let serializersStub
  let streamsStub
  let bunyanStub

  beforeEach(function () {
    serializersStub = jest.fn()
    streamsStub = {
      buildConsoleStream: jest.fn(),
      buildFileStream: jest.fn()
    }
    bunyanStub = {
      createLogger: function () {
        return {
          addStream: jest.fn()
        }
      }
    }
  })

  it('should add the buildConsoleStream and buildFileStream', function () {
    require('../../../app/services/log')
    sinon.toHaveBeenCalledTimes(1)
    sinon.toHaveBeenCalledTimes(1)
  })
})
