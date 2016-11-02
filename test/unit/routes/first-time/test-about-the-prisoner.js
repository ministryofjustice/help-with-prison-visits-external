const supertest = require('supertest')
const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const express = require('express')
const bodyParser = require('body-parser')
const mockViewEngine = require('../mock-view-engine')
const firstTimeClaim = require('../../../../app/services/data/first-time-claim')
const UrlPathValidator = require('../../../../app/services/validators/url-path-validator')

var stubAboutThePrisonerValidator
var request

describe('routes/first-time/about-the-prisoner', function () {
  var sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    stubAboutThePrisonerValidator = sinon.stub()
    var route = proxyquire('../../../../app/routes/first-time/about-the-prisoner', {
      '../../services/data/first-time-claim': firstTimeClaim,
      '../../services/validators/first-time/about-the-prisoner-validator': stubAboutThePrisonerValidator
    })

    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('GET /first-time/:dob/:relationship/:benefit', function () {
    it('should respond with a 200 for valid path parameters', function () {
      request
        .get('/first-time/1980-01-01/partner/income-support')
        .expect(200)
        .end(function (error) {
          expect(error).to.be.null
        })
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .get('/first-time/1980-01-01/partner/income-support')
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })

  describe('POST /first-time/:dob/:relationship/:benefit', function () {
    it('should persist data and redirect to first-time/about-you for valid data', function () {
      var newReference = '1234567'
      var stubInsertNewEligibilityAndPrisoner = sinon.stub(firstTimeClaim, 'insertNewEligibilityAndPrisoner').resolves(newReference)
      stubAboutThePrisonerValidator.returns(false)

      request
        .post('/first-time/1980-01-01/partner/income-support')
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(stubAboutThePrisonerValidator.calledOnce).to.be.true
          expect(stubInsertNewEligibilityAndPrisoner.calledOnce).to.be.true
          expect(response.header.location).to.equal(`/first-time/1980-01-01/partner/income-support/${newReference}`)
        })
    })
    it('should respond with a 400 for invalid data', function () {
      stubAboutThePrisonerValidator.returns({ 'firstName': [] })
      request
        .post('/first-time/1980-01-01/partner/income-support')
        .expect(400)
        .end(function (error) {
          expect(error).to.be.null
          expect(stubAboutThePrisonerValidator.calledOnce).to.be.true
        })
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .post('/first-time/1980-01-01/partner/income-support')
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })
})
