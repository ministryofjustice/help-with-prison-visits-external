var supertest = require('supertest')
var expect = require('chai').expect
var proxyquire = require('proxyquire')
var express = require('express')
var mockViewEngine = require('../mock-view-engine')

var route = proxyquire('../../../../app/routes/first-time/about-the-prisoner', {
  '../services/log': { info: function (text) {} }
})
var request

describe('routes/first-time/about-the-prisoner', function () {
  beforeEach(function () {
    var app = express()
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
  })

  describe('GET /first-time/:dob/:relationship/:assistance/:requireBenefitUpload', function () {
    it('should respond with a 200 for valid path parameters', function (done) {
      request
        .get('/first-time/1980-01-01/partner/n/n')
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          // TODO check called path validator returning true
          done()
        })
    })
    it('should respond with a 500 for invalid path parameters', function (done) {
      // TODO stub path validator and return false
      done()
    })
  })

  describe('POST /first-time/:dob/:relationship/:assistance/:requireBenefitUpload', function () {
    it('should persist data and redirect to first-time/about-you for valid data', function (done) {
      var newReference = '1234567'

      request
        .post('/first-time/1980-01-01/partner/n/n')
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(response.header.location).to.equal(`/first-time/1980-01-01/partner/n/n/${newReference}`)
          // TODO check called path validator returning true
          // TODO check called validator
          // TODO check called to persist
          done()
        })
    })
    it('should respond with a 500 for invalid path parameters', function (done) {
      // TODO stub path validator and return false
      done()
    })
  })
})
