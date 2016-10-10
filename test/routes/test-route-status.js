/* global describe beforeEach it */
var supertest = require('supertest')
var express = require('express')
var route = require('../../app/routes/status')

describe('status', function () {
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
