const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('services/log', function () {
  var serializersStub
  var streamsStub
  var bunyanStub

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
    proxyquire('../../../app/services/log', {
      bunyan: bunyanStub,
      './log-serializers': serializersStub,
      './log-streams': streamsStub
    })
    sinon.assert.calledOnce(streamsStub.buildConsoleStream)
    sinon.assert.calledOnce(streamsStub.buildFileStream)
  })
})
