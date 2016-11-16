var supertest = require('supertest')
var expect = require('chai').expect
var proxyquire = require('proxyquire')
var express = require('express')
var mockViewEngine = require('./mock-view-engine')
var log = {
  info: function (text) {}
}
var route = proxyquire('../../../app/routes/index', {
  '../services/log': log
})

describe('routes/index', function () {
  var request

  beforeEach(function () {
    var app = express()

    mockViewEngine(app, '../../../app/views')

    route(app)

    request = supertest(app)
  })

  describe('GET /', function () {
    it('should respond with a 200', function () {
      return request
        .get('/')
        .expect(200)
    })
  })

  describe('GET /assisted-digital?caseworker=a@b.com', function () {
    it('should respond with a 302 and set cookie', function () {
      return request
        .get('/assisted-digital?caseworker=a@b.com')
        .expect(302)
        .expect(function (response) {
          expect(response.header['set-cookie'][0]).to.contain('apvs-assisted-digital')
        })
    })
  })
})
