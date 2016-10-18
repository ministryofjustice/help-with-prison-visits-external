var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
var log = {
  info: function (text) {}
}
var route = proxyquire('../../../../app/routes/health-check/status', {
  '../services/log': log
})

describe('routes/health-check/status', function () {
  var request

  beforeEach(function () {
    var app = express()

    route(app)

    request = supertest(app)
  })

  describe('GET /status', function () {
    it('should respond with a 200', function () {
      request
        .get('/status')
        .expect(200)
    })
  })
})
