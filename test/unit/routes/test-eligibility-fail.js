var supertest = require('supertest')
var expect = require('chai').expect
var express = require('express')
var mockViewEngine = require('./mock-view-engine')
var route = require('../../../app/routes/eligibility-fail')

describe('routes/eligibility-fail', function () {
  var request

  beforeEach(function () {
    var app = express()

    mockViewEngine(app, '../../../app/views')

    route(app)

    request = supertest(app)
  })

  describe('GET /eligibility-fail', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/eligibility-fail')
        .expect(200, function (error) {
          expect(error).to.be.null
          done()
        })
    })
  })
})
