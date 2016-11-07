const supertest = require('supertest')
const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const express = require('express')
const bodyParser = require('body-parser')
const mockViewEngine = require('../mock-view-engine')

var stubInsertVisitor
var stubAboutYouValidator
var request

describe('routes/first-time/new-eligibility/about-you', function () {
  const REFERENCE = '1234567'
  const ROUTE = `/first-time/new-eligibility/1980-01-01/partner/income-support/${REFERENCE}`
  var urlValidatorCalled = false

  beforeEach(function () {
    stubInsertVisitor = sinon.stub()
    stubAboutYouValidator = sinon.stub()
    var route = proxyquire('../../../../app/routes/first-time/new-eligibility/about-you', {
      '../../../services/data/insert-visitor': stubInsertVisitor,
      '../../../services/validators/first-time/about-you-validator': stubAboutYouValidator,
      '../../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
    })

    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe('GET /first-time/new-eligibility/:dob/:relationship/:benefit/:reference', function () {
    it('should respond with a 200 for valid path parameters', function (done) {
      request
        .get(ROUTE)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })

  describe('POST /first-time/new-eligibility/:dob/:relationship/:benefit/:reference', function () {
    it('should persist data and redirect to /application-submitted/:reference for valid data', function (done) {
      stubInsertVisitor.resolves()
      stubAboutYouValidator.returns(false)

      request
        .post(ROUTE)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(stubAboutYouValidator.calledOnce).to.be.true
          expect(stubInsertVisitor.calledOnce).to.be.true
          expect(response.header.location).to.equal(`/first-time/eligibility/${REFERENCE}/new-claim`)
          done()
        })
    })

    it('should respond with a 400 for invalid data', function (done) {
      stubAboutYouValidator.returns({ 'Title': [] })
      request
        .post(ROUTE)
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
