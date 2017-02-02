const proxyquire = require('proxyquire')
const sinon = require('sinon')

const LOGSTASH_HOST = 'some host'
const LOGSTASH_PORT = 'some port'

const CONFIG = {
  LOGSTASH_HOST: LOGSTASH_HOST,
  LOGSTASH_PORT: LOGSTASH_PORT
}

describe('services/log', function () {
  var serializersStub
  var streamsStub
  var bunyanStub

  beforeEach(function () {
    serializersStub = sinon.stub()
    streamsStub = {
      buildLogstashStream: sinon.stub(),
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

  it('should add all of the streams if config.LOGSTASH_HOST and config.LOGSTASH_PORT are set', function () {
    proxyquire('../../../app/services/log', {
      '../../config': CONFIG,
      'bunyan': bunyanStub,
      './log-serializers': serializersStub,
      './log-streams': streamsStub
    })

    sinon.assert.calledOnce(streamsStub.buildLogstashStream)
    sinon.assert.calledOnce(streamsStub.buildConsoleStream)
    sinon.assert.calledOnce(streamsStub.buildFileStream)
  })

  it('should not add the buildLogstashStream if config.LOGSTASH_HOST and config.LOGSTASH_PORT are not set', function () {
    proxyquire('../../../app/services/log', {
      'bunyan': bunyanStub,
      './log-serializers': serializersStub,
      './log-streams': streamsStub
    })
    sinon.assert.notCalled(streamsStub.buildLogstashStream)
    sinon.assert.calledOnce(streamsStub.buildConsoleStream)
    sinon.assert.calledOnce(streamsStub.buildFileStream)
  })
})
