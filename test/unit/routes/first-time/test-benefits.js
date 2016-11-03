const supertest = require('supertest')
const proxyquire = require('proxyquire')
const express = require('express')
const mockViewEngine = require('../mock-view-engine')
const bodyParser = require('body-parser')
const sinon = require('sinon')
const UrlPathValidator = require('../../../../app/services/validators/url-path-validator')

var validationErrors

describe('routes/first-time/benefits', function () {
  var request
  var sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')

    request = supertest(app)
    validationErrors = false

    var route = proxyquire(
      '../../../../app/routes/first-time/benefits', {
        '../../services/validators/eligibility/benefit-validator': function () { return validationErrors }
      })
    route(app)
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('GET /first-time/:dob/:relationship', function () {
    it('should respond with a 200', function () {
      return request
        .get('/first-time/1980-01-01/partner')
        .expect(200)
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .get('/first-time/1980-01-01/partner')
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })

  describe('POST /first-time/:dob/:relationship', function () {
    it('should respond with a 302', function () {
      return request
        .post('/first-time/1980-01-01/partner')
        .expect(302)
    })

    it('should response with a 400 if validation fails', function () {
      validationErrors = { 'benefit': [] }
      return request
        .post('/first-time/1980-01-01/partner')
        .expect(400)
    })

    it('should redirect to eligibility-fail page if benefit is none', function () {
      return request
        .post('/first-time/1980-01-01/partner')
        .send({
          benefit: 'none'
        })
        .expect('location', '/eligibility-fail')
    })

    it('should redirect to /first-time/:dob/:relationship/:benefit page if benefit is any value other than none', function () {
      var benefit = 'no'
      request
        .post('/first-time/1980-01-01/partner')
        .send({
          benefit: benefit
        })
        .expect('location', `/first-time/1980-01-01/partner/${benefit}`)
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .post('/first-time/1980-01-01/partner')
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })
})
