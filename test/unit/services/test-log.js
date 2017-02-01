const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const LOGSTASH_HOST = 'some host'
const LOGSTASH_PORT = 'some port'

const CONFIG = {
  LOGSTASH_HOST: LOGSTASH_HOST,
  LOGSTASH_PORT: LOGSTASH_PORT
}

describe('services/log', function () {
  var log

  var bunyanLogstashTcpStub

  beforeEach(function () {
    bunyanLogstashTcpStub = {
      createStream: function() {
        return {
          on: sinon.stub()
        }
      },
    }

    log = proxyquire('../../../app/services/log', {
      '../../config': CONFIG,
      'bunyan-logstash-tcp': bunyanLogstashTcpStub
    })
  })

  it('should create a log called external web', function () {
    expect(log.fields.name).to.equal('external-web')
  })

  it('should append all three streams; logstash, file, and console', function () {
    expect(log.streams).to.have.length(3)
  })

  it('should append a logstash stream', function () {
    expect(log.streams[0]).to.have.property('type', 'raw' )
  })

  it('should append a console stream', function () {
    expect(log.streams[1]).to.have.property('type', 'stream' )
  })

  it('should append a file stream', function () {
    expect(log.streams[2]).to.have.property('type', 'rotating-file' )
  })

  it('should append the requestSerializer', function () {
    expect(log.serializers.request).to.not.equal(null)
  })

  it('should append the responseSerializer', function () {
    expect(log.serializers.response).to.not.equal(null)
  })

  it('should append the errorSerializer', function () {
    expect(log.serializers.error).to.not.equal(null)
  })

})
