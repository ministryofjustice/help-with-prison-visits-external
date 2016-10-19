var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
var mockViewEngine = require('../mock-view-engine')
var bodyParser = require('body-parser')
var validationErrors

var route = proxyquire(
  '../../../../app/routes/payment/bank-account-details', {
    '../../services/validators/payment/bank-account-details-validator': function () { return validationErrors }
  })

describe('routes/payment/bank-account-details', function () {
  var request
  const VALID_DATA = {
    'AccountNumber': '12345678',
    'SortCode': '123456'
  }

  beforeEach(function () {
    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    validationErrors = false
  })

  describe('GET /bank-account-details', function () {
    it('should respond with a 200', function (done) {
      request
        .get('/bank-account-details')
        .expect(200)
        .end(done)
    })
  })

  describe('POST /bank-account-details', function () {
    it('should respond with a 302', function (done) {
      request
        .post('/bank-account-details')
        .send(VALID_DATA)
        .expect(302)
        .end(done)
    })

    it('should respond with a 400 if validation fails', function (done) {
      validationErrors = { 'AccountNumber': '', 'SortCode': '' }
      request
        .post('/bank-account-details')
        .expect(400)
        .end(done)
    })

    it('should redirect to /first-time/:dob/:relationship/:journeyAssistance', function (done) {
      request
        .post('/bank-account-details')
        .send(VALID_DATA)
        .expect('location', '/application-submitted/1234567')
        .end(done)
    })
  })
})
