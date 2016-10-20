const supertest = require('supertest')
const proxyquire = require('proxyquire')
const express = require('express')
const mockViewEngine = require('../mock-view-engine')
const bodyParser = require('body-parser')
const dateFormatter = require('../../../../app/services/date-formatter')

var validationErrors

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

    request = supertest(app)
    validationErrors = false

    var route = proxyquire(
      '../../../../app/routes/first-time/journey-assistance', {
        '../../services/validators/eligibility/journey-assistance-validator': function () { return validationErrors },
        '../../services/validators/url-path-validator': function () { }
      })
    route(app)
  })

  describe('GET /first-time/:dob/:relationship', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/first-time/' + dob + '/partner')
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time/:dob/:relationship', function () {
    it('should respond with a 302', function (done) {
      var journeyAssistance = 'No'

      request
        .post('/first-time/' + dob + '/partner')
        .send({
          'journey-assistance': journeyAssistance
        })
        .expect(302)
        .end(done)
    })

    it('should respond with a 400 if validation fails', function (done) {
      validationErrors = { 'journeyAssistance': [] }
      request
        .post('/first-time/' + dob + '/partner')
        .expect(400)
        .end(done)
    })

    it('should redirect to /first-time/:dob/:relationship/:journeyAssistance', function (done) {
      var journeyAssistance = 'No'

      request
        .post('/first-time/' + dob + '/partner')
        .send({
          'journey-assistance': journeyAssistance
        })
        .expect('location', '/first-time/' + dob + '/partner/' + journeyAssistance)
        .end(done)
    })
  })
})
