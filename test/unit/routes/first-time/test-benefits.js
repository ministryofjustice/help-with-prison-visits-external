const supertest = require('supertest')
const proxyquire = require('proxyquire')
const express = require('express')
const mockViewEngine = require('../mock-view-engine')
const bodyParser = require('body-parser')
const expect = require('chai').expect

var validationErrors

describe('routes/first-time/new-eligibility/benefits', function () {
  const ROUTE = '/first-time/new-eligibility/1980-01-01/partner'
  var request
  var urlValidatorCalled = false

  beforeEach(function () {
    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')

    request = supertest(app)
    validationErrors = false

    var route = proxyquire(
      '../../../../app/routes/first-time/new-eligibility/benefits', {
        '../../../services/validators/eligibility/benefit-validator': function () { return validationErrors },
        '../../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
      })
    route(app)
    urlValidatorCalled = false
  })

  describe('GET /first-time/new-eligibility/:dob/:relationship', function () {
    it('should respond with a 200', function (done) {
      request
        .get(ROUTE)
        .expect(200)
        .expect(function () {
          expect(urlValidatorCalled).to.be.true
        })
        .end(done)
    })
  })

  describe('POST /first-time/new-eligibility/:dob/:relationship', function () {
    it('should respond with a 302', function (done) {
      request
        .post(ROUTE)
        .expect(302)
        .end(function () {
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })

    it('should response with a 400 if validation fails', function (done) {
      validationErrors = { 'benefit': [] }
      request
        .post(ROUTE)
        .expect(400)
        .end(function () {
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })

    it('should redirect to eligibility-fail page if benefit is none', function (done) {
      request
        .post(ROUTE)
        .send({
          benefit: 'none'
        })
        .expect('location', '/eligibility-fail')
        .end(function () {
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })

    it('should redirect to /first-time/:dob/:relationship/:benefit page if benefit is any value other than none', function (done) {
      var benefit = 'no'

      request
        .post(ROUTE)
        .send({
          benefit: benefit
        })
        .expect('location', `${ROUTE}/${benefit}`)
        .end(function () {
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })
})
