/* global describe beforeEach it */
var supertest = require('supertest')
var expect = require('chai').expect

var path = require('path')
var express = require('express')
var nunjucks = require('express-nunjucks')
var route = require('../../app/routes/index')

describe('index', function () {
  var request

  beforeEach(function () {
    var app = express()

    app.set('view engine', 'html')
    app.set('views', path.join(__dirname, '../../app/views'))
    nunjucks(app)

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
