const supertest = require('supertest')
const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const express = require('express')
const bodyParser = require('body-parser')
const mockViewEngine = require('../mock-view-engine')
const UrlPathValidator = require('../../../../app/services/validators/url-path-validator')

var stubInsertVisitor
var stubAboutYouValidator
var request

describe('routes/first-time/about-you', function () {
  var sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    stubInsertVisitor = sinon.stub()
    stubAboutYouValidator = sinon.stub()
    var route = proxyquire('../../../../app/routes/first-time/about-you', {
      '../../services/data/insert-visitor': stubInsertVisitor,
      '../../services/validators/first-time/about-you-validator': stubAboutYouValidator
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

  describe('GET /first-time/:dob/:relationship/:benefit/:reference', function () {
    it('should respond with a 200 for valid path parameters', function (done) {
      request
        .get('/first-time/1980-01-01/partner/income-support/1234567')
        .expect(200)
        .end(function (error) {
          expect(error).to.be.null
          done()
        })
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .get('/first-time/1980-01-01/partner/income-support/1234567')
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })

  describe('POST /first-time/:dob/:relationship/:benefit/:reference', function () {
    it('should persist data and redirect to /application-submitted/:reference for valid data', function () {
      var reference = '1234567'
      stubInsertVisitor.resolves()
      stubAboutYouValidator.returns(false)

      return request
        .post(`/first-time/1980-01-01/partner/income-support/${reference}`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(stubAboutYouValidator.calledOnce).to.be.true
          expect(stubInsertVisitor.calledOnce).to.be.true
          expect(response.header.location).to.equal(`/first-time-claim/eligibility/${reference}/new-claim`)
        })
    })

    it('should respond with a 400 for invalid data', function (done) {
      var reference = '1234567'
      stubAboutYouValidator.returns({ 'Title': [] })
      request
        .post(`/first-time/1980-01-01/partner/income-support/${reference}`)
        .expect(400)
        .end(function (error) {
          expect(error).to.be.null
          done()
        })
    })

    it('should call the URL Path Validator ', function () {
      var reference = '1234567'
      stubAboutYouValidator.returns({ 'Title': [] })
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .post(`/first-time/1980-01-01/partner/income-support/${reference}`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })
})
