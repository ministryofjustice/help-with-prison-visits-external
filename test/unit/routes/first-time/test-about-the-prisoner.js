const supertest = require('supertest')
const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const express = require('express')
const bodyParser = require('body-parser')
const mockViewEngine = require('../mock-view-engine')
const firstTimeClaim = require('../../../../app/services/data/first-time-claim')
var stubAboutThePrisonerValidator
var request

describe('routes/first-time/about-the-prisoner', function () {
  var urlValidatorCalled = false

  beforeEach(function () {
    stubAboutThePrisonerValidator = sinon.stub()
    var route = proxyquire('../../../../app/routes/first-time/about-the-prisoner', {
      '../../services/data/first-time-claim': firstTimeClaim,
      '../../services/validators/first-time/about-the-prisoner-validator': stubAboutThePrisonerValidator,
      '../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
    })

    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe('GET /first-time/:dob/:relationship/:requireBenefitUpload', function () {
    it('should respond with a 200 for valid path parameters', function (done) {
      request
        .get('/first-time/1980-01-01/partner/n')
        .expect(200)
        .end(function (error) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })

  describe('POST /first-time/:dob/:relationship/:requireBenefitUpload', function () {
    it('should persist data and redirect to first-time/about-you for valid data', function (done) {
      var newReference = '1234567'
      var stubInsertNewEligibilityAndPrisoner = sinon.stub(firstTimeClaim, 'insertNewEligibilityAndPrisoner').resolves(newReference)
      stubAboutThePrisonerValidator.returns(false)

      request
        .post('/first-time/1980-01-01/partner/n')
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(stubAboutThePrisonerValidator.calledOnce).to.be.true
          expect(stubInsertNewEligibilityAndPrisoner.calledOnce).to.be.true
          expect(response.header.location).to.equal(`/first-time/1980-01-01/partner/n/${newReference}`)
          done()
        })
    })
    it('should respond with a 400 for invalid data', function (done) {
      stubAboutThePrisonerValidator.returns({ 'firstName': [] })
      request
        .post('/first-time/1980-01-01/partner/n')
        .expect(400)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(stubAboutThePrisonerValidator.calledOnce).to.be.true
          done()
        })
    })
  })
})
