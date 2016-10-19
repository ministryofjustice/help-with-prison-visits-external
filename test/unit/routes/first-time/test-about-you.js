var supertest = require('supertest')
var expect = require('chai').expect
var proxyquire = require('proxyquire')
var sinon = require('sinon')
require('sinon-bluebird')
var express = require('express')
var bodyParser = require('body-parser')
var mockViewEngine = require('../mock-view-engine')
var visitor = require('../../../../app/services/data/visitor')
var stubAboutYouValidator
var request

describe('routes/first-time/about-you', function () {
  beforeEach(function () {
    stubAboutYouValidator = sinon.stub()
    var route = proxyquire('../../../../app/routes/first-time/about-you', {
      '../../services/data/visitor': visitor,
      '../../services/validators/first-time/about-you-validator': stubAboutYouValidator
    })

    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
  })

  describe('GET /first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function () {
    it('should respond with a 200 for valid path parameters', function (done) {
      request
        .get('/first-time/1980-01-01/partner/n/n/1234567')
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

  describe('POST /first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function () {
    it('should persist data and redirect to /application-submitted/:reference for valid data', function (done) {
      var reference = '1234567'
      var stubInsert = sinon.stub(visitor, 'insert').resolves()
      stubAboutYouValidator.returns(false)

      request
        .post('/first-time/1980-01-01/partner/n/n/' + reference)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          // TODO check called path validator returning true
          expect(stubAboutYouValidator.calledOnce).to.be.true
          expect(stubInsert.calledOnce).to.be.true
          expect(response.header.location).to.equal(`/application-submitted/${reference}`)
          done()
        })
    })
    it('should respond with a 500 for invalid path parameters', function (done) {
      // TODO stub path validator and return false
      done()
    })
    it('should respond with a 400 for invalid data', function (done) {
      var reference = '1234567'
      stubAboutYouValidator.returns({ 'Title': [] })
      request
        .post('/first-time/1980-01-01/partner/n/n/' + reference)
        .expect(400)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(stubAboutYouValidator.calledOnce).to.be.true
          done()
        })
    })
  })
})
