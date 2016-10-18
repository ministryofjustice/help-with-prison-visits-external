var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
var mockViewEngine = require('../mock-view-engine')
var bodyParser = require('body-parser')
const dateFormatter = require('../../../../app/services/date-formatter')

var validationErrors

var route = proxyquire(
  '../../../../app/routes/eligibility/first-time-eligibility-flow', {
    '../../services/validators/eligibility/prisoner-relationship-validator': function (data) { return validationErrors },
    '../../services/validators/eligibility/date-of-birth-validator': function (data) { return validationErrors },
    '../../services/validators/eligibility/journey-assistance-validator': function (data) { return validationErrors },
    '../../services/validators/eligibility/benefit-validator': function (data) { return validationErrors }
  })

describe('first-time-eligibility-flow', function () {
  var request

  beforeEach(function () {
    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    validationErrors = false
  })

  // date-of-birth
  describe('GET /first-time', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time')
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time', function () {
    var dobDay = '01'
    var dobMonth = '05'
    var dobYear = '1955'

    it('should respond with a 302', function (done) {
      request
        .post('/first-time')
        .send({
          'dob-day': dobDay,
          'dob-month': dobMonth,
          'dob-year': dobYear
        })
        .expect(302)
        .end(done)
    })

    it('should build and appened the correct DOB to the redirect URL', function (done) {
      var dobDay = '01'
      var dobMonth = '05'
      var dobYear = '1955'
      var dob = dateFormatter.buildFormatted(dobDay, dobMonth, dobYear)

      request
        .post('/first-time')
        .send({
          'dob-day': dobDay,
          'dob-month': dobMonth,
          'dob-year': dobYear
        })
        .expect('location', '/first-time/' + dob)
        .end(done)
    })
  })

  // prison-relationship
  describe('GET /first-time/:dob', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time/01-01-1990')
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time/:dob', function () {
    it('should respond with a 302', function (done) {
      request
        .post('/first-time/01-01-1990')
        .expect(302)
        .end(done)
    })

    it('should respond with a 400 if validation fails', function (done) {
      validationErrors = { 'relationship': [] }
      request
        .post('/first-time/01-01-1990')
        .expect(400)
        .end(done)
    })

    it('should redirect to eligibility-fail page if relationship is None of the above', function (done) {
      request
        .post('/first-time/01-01-1990')
        .send({
          relationship: 'None of the above'
        })
        .expect('location', '/eligibility-fail')
        .end(done)
    })

    it('should redirect to /first-time/:dob/:relationship page if relationship is any value other than None of the above', function (done) {
      var relationship = 'not-none-of-the-above'

      request
        .post('/first-time/01-01-1990')
        .send({
          relationship: relationship
        })
        .expect('location', '/first-time/01-01-1990/' + relationship)
        .end(done)
    })
  })

  // journey-assistance
  describe('GET /first-time/:dob/:relationship', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time/01-01-1990/Partner')
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time/:dob/:relationship', function () {
    it('should respond with a 302', function (done) {
      var journeyAssistance = 'No'

      request
        .post('/first-time/01-01-1990/Partner')
        .send({
          'journey-assistance': journeyAssistance
        })
        .expect(302)
        .end(done)
    })

    it('should respond with a 400 if validation fails', function (done) {
      validationErrors = { 'journeyAssistance': [] }
      request
        .post('/first-time/01-01-1990/Partner')
        .expect(400)
        .end(done)
    })

    it('should redirect to /first-time/:dob/:relationship/:journeyAssistance', function (done) {
      var journeyAssistance = 'No'

      request
        .post('/first-time/01-01-1990/Partner')
        .send({
          'journey-assistance': journeyAssistance
        })
        .expect('location', '/first-time/01-01-1990/Partner/' + journeyAssistance)
        .end(done)
    })
  })

  // benefits
  describe('GET /first-time/:dob/:relationship/:journeyAssistance', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time/01-01-1990/Partner/No')
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time/:dob/:relationship/:journeyAssistance', function () {
    it('should respond with a 302', function (done) {
      request
        .post('/first-time/01-01-1990/Partner/No')
        .expect(302)
        .end(done)
    })

    it('should response with a 400 if validation fails', function (done) {
      validationErrors = { 'benefit': [] }
      request
        .post('/first-time/01-01-1990/Partner/No')
        .expect(400)
        .end(done)
    })

    it('should redirect to eligibility-fail page if benefit is None of the above', function (done) {
      request
        .post('/first-time/01-01-1990/Partner/No')
        .send({
          benefit: 'None of the above'
        })
        .expect('location', '/eligibility-fail')
        .end(done)
    })

    it('should redirect to /first-time/:dob/:relationship/:journeyAssistance/:benefit page if benefit is any value other than None of the above', function (done) {
      var benefit = 'Income Support'

      request
        .post('/first-time/01-01-1990/Partner/No')
        .send({
          benefit: benefit
        })
        .expect('location', '/first-time/01-01-1990/Partner/No/' + benefit)
        .end(done)
    })
  })
})
