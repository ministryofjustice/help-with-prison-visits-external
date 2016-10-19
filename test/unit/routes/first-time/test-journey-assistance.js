var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
var mockViewEngine = require('../mock-view-engine')
var bodyParser = require('body-parser')
const dateFormatter = require('../../../../app/services/date-formatter')

var validationErrors

var route = proxyquire(
  '../../../../app/routes/first-time/journey-assistance', {
    '../../services/validators/eligibility/journey-assistance-validator': function () { return validationErrors }
  })

describe('routes/first-time/journey-assistance', function () {
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

  describe('GET /first-time/:dob/:relationship', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time/' + dob + '/Partner')
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time/:dob/:relationship', function () {
    it('should respond with a 302', function (done) {
      var journeyAssistance = 'No'

      request
        .post('/first-time/' + dob + '/Partner')
        .send({
          'journey-assistance': journeyAssistance
        })
        .expect(302)
        .end(done)
    })

    it('should respond with a 400 if validation fails', function (done) {
      validationErrors = { 'journeyAssistance': [] }
      request
        .post('/first-time/' + dob + '/Partner')
        .expect(400)
        .end(done)
    })

    it('should redirect to /first-time/:dob/:relationship/:journeyAssistance', function (done) {
      var journeyAssistance = 'No'

      request
        .post('/first-time/' + dob + '/Partner')
        .send({
          'journey-assistance': journeyAssistance
        })
        .expect('location', '/first-time/' + dob + '/Partner/' + journeyAssistance)
        .end(done)
    })
  })
})
