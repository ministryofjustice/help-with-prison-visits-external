/* global describe beforeEach it */
var supertest = require('supertest')
var path = require('path')
var express = require('express')
var nunjucks = require('express-nunjucks')
var route = require('../../app/routes/status')

describe('status', function () {
  var request

  beforeEach(function () {
    var app = express()

    app.set('view engine', 'html')
    app.set('views', path.join(__dirname, '../../app/views'))
    nunjucks(app)

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
