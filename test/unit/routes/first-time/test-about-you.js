const supertest = require('supertest')
const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const express = require('express')
const bodyParser = require('body-parser')
const mockViewEngine = require('../mock-view-engine')
const visitor = require('../../../../app/services/data/visitor')
var stubAboutYouValidator
var request

describe('routes/first-time/about-you', function () {
  var urlValidatorCalled = false

  beforeEach(function () {
    stubAboutYouValidator = sinon.stub()
    var route = proxyquire('../../../../app/routes/first-time/about-you', {
      '../../services/data/visitor': visitor,
      '../../services/validators/first-time/about-you-validator': stubAboutYouValidator,
      '../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
    })

    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe('GET /first-time/:dob/:relationship/:assistance/:requireBenefitUpload/:reference', function () {
    it('should respond with a 200 for valid path parameters', function (done) {
      request
        .get('/first-time/1980-01-01/partner/n/n/1234567')
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
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
          expect(urlValidatorCalled).to.be.true
          expect(stubAboutYouValidator.calledOnce).to.be.true
          expect(stubInsert.calledOnce).to.be.true
          expect(response.header.location).to.equal(`/first-time-claim/eligibility/${reference}/new-claim`)
          done()
        })
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
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })
})
