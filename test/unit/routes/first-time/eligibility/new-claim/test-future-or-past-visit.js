const supertest = require('supertest')
const proxyquire = require('proxyquire')
const expect = require('chai').expect
const express = require('express')
const bodyParser = require('body-parser')
const mockViewEngine = require('../../../mock-view-engine')
const sinon = require('sinon')
const UrlPathValidator = require('../../../../../../app/services/validators/url-path-validator')

var request

describe('routes/first-time/eligibility/new-claim/future-or-past-visit', function () {
  var sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    var app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    mockViewEngine(app, '../../../app/views')
    var route = proxyquire('../../../../../../app/routes/first-time/eligibility/new-claim/future-or-past-visit', {})
    route(app)
    request = supertest(app)
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('GET /first-time/eligibility/:reference/new-claim', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time-claim/eligibility/1234567/new-claim')
        .expect(200)
        .end(function (error) {
          expect(error).to.be.null
          done()
        })
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .get('/first-time-claim/eligibility/1234567/new-claim')
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })

  describe('POST /first-time/eligibility/:reference/new-claim', function () {
    it('should redirect to /first-time/eligibility/:reference/new-claim/past', function (done) {
      // Currently no validation or logic as future claims have not been implemented
      var reference = '1234567'

      request
        .post(`/first-time-claim/eligibility/${reference}/new-claim`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(response.header.location).to.equal(`/first-time-claim/eligibility/${reference}/new-claim/past`)
          done()
        })
    })

    it('should call the URL Path Validator ', function () {
      var reference = '1234567'
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .post(`/first-time-claim/eligibility/${reference}/new-claim`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })
})
