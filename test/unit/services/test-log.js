const sinon = require('sinon')

jest.mock(bunyan, () => bunyanStub)
jest.mock('./log-serializers', () => serializersStub)
jest.mock('./log-streams', () => streamsStub)

describe('services/log', function () {
  let serializersStub
  let streamsStub
  let bunyanStub

  beforeEach(function () {
    serializersStub = sinon.stub()
    streamsStub = {
      buildConsoleStream: sinon.stub(),
      buildFileStream: sinon.stub()
    }
    bunyanStub = {
      createLogger: function () {
        return {
          addStream: sinon.stub()
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
