var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
var mockViewEngine = require('../mock-view-engine')
var bodyParser = require('body-parser')
const dateFormatter = require('../../../../app/services/date-formatter')

var validationErrors

var route = proxyquire(
  '../../../../app/routes/first-time/benefits', {
    '../../services/validators/eligibility/benefit-validator': function () { return validationErrors }
  })

describe('routes/first-time/benefits', function () {
  var request
  var dobDay = '01'
  var dobMonth = '05'
  var dobYear = '1955'
  var dob = dateFormatter.buildFormatted(dobDay, dobMonth, dobYear)

  beforeEach(function () {
    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    validationErrors = false
  })

  // benefits
  describe('GET /first-time/:dob/:relationship/:journeyAssistance', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time/' + dob + '/Partner/No')
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time/:dob/:relationship/:journeyAssistance', function () {
    it('should respond with a 302', function (done) {
      request
        .post('/first-time/' + dob + '/Partner/No')
        .expect(302)
        .end(done)
    })

    it('should response with a 400 if validation fails', function (done) {
      validationErrors = { 'benefit': [] }
      request
        .post('/first-time/' + dob + '/Partner/No')
        .expect(400)
        .end(done)
    })

    it('should redirect to eligibility-fail page if benefit is None of the above', function (done) {
      request
        .post('/first-time/' + dob + '/Partner/No')
        .send({
          benefit: 'none'
        })
        .expect('location', '/eligibility-fail')
        .end(done)
    })

    it('should redirect to /first-time/:dob/:relationship/:journeyAssistance/:benefit page if benefit is any value other than None of the above', function (done) {
      var benefit = 'No'

      request
        .post('/first-time/' + dob + '/Partner/No')
        .send({
          benefit: benefit
        })
        .expect('location', '/first-time/' + dob + '/Partner/No/' + benefit)
        .end(done)
    })
  })
})
