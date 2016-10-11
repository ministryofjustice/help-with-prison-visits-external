/* global describe beforeEach it */
var supertest = require('supertest')
var expect = require('chai').expect
var express = require('express')
var mockViewEngine = require('./mock-view-engine')
var route = require('../../../app/routes/index')

describe('index', function () {
  var request

  beforeEach(function () {
    var app = express()

    mockViewEngine(app, '../../../app/views')

    route(app)

    request = supertest(app)
  })

  describe('GET /', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/')
        .expect(200, function (error, response) {
          expect(error).to.be.null
          done()
        })
    })
  })
})
