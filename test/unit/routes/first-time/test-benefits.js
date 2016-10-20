const supertest = require('supertest')
const proxyquire = require('proxyquire')
const express = require('express')
const mockViewEngine = require('../mock-view-engine')
const bodyParser = require('body-parser')
const expect = require('chai').expect
const dateFormatter = require('../../../../app/services/date-formatter')

var validationErrors

describe('routes/first-time/benefits', function () {
  var request
  var dobDay = '01'
  var dobMonth = '05'
  var dobYear = '1955'
  var dob = dateFormatter.buildFormatted(dobDay, dobMonth, dobYear)
  var urlValidatorCalled = false

  beforeEach(function () {
    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')

    request = supertest(app)
    validationErrors = false

    var route = proxyquire(
      '../../../../app/routes/first-time/benefits', {
        '../../services/validators/eligibility/benefit-validator': function () { return validationErrors },
        '../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
      })
    route(app)
    urlValidatorCalled = false
  })

  // benefits
  describe('GET /first-time/:dob/:relationship/:journeyAssistance', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time/' + dob + '/partner/no')
        .expect(200)
        .expect(function () {
          expect(urlValidatorCalled).to.be.true
        })
        .end(done)
    })
  })

  describe('POST /first-time/:dob/:relationship/:journeyAssistance', function () {
    it('should respond with a 302', function (done) {
      request
        .post('/first-time/' + dob + '/partner/no')
        .expect(302)
        .end(function () {
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })

    it('should response with a 400 if validation fails', function (done) {
      validationErrors = { 'benefit': [] }
      request
        .post('/first-time/' + dob + '/partner/no')
        .expect(400)
        .end(function () {
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })

    it('should redirect to eligibility-fail page if benefit is none', function (done) {
      request
        .post('/first-time/' + dob + '/partner/no')
        .send({
          benefit: 'none'
        })
        .expect('location', '/eligibility-fail')
        .end(function () {
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })

    it('should redirect to /first-time/:dob/:relationship/:journeyAssistance/:benefit page if benefit is any value other than none', function (done) {
      var benefit = 'No'

      request
        .post('/first-time/' + dob + '/partner/no')
        .send({
          benefit: benefit
        })
        .expect('location', '/first-time/' + dob + '/partner/no/' + benefit)
        .end(function () {
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })
})
