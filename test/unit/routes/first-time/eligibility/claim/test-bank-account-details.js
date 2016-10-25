var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
const expect = require('chai').expect
var mockViewEngine = require('../../../mock-view-engine')
var bodyParser = require('body-parser')
const sinon = require('sinon')
require('sinon-bluebird')
var validationErrors
var bankAccountDetails = require('../../../../../../app/services/data/bank-account-details')
var reference = 'V123456'
var claimId = '1'

var route = proxyquire(
  '../../../../../../app/routes/first-time/eligibility/claim/bank-account-details', {
    '../../../../services/validators/payment/bank-account-details-validator': function () { return validationErrors },
    '../../../../services/data/bank-account-details': bankAccountDetails
  })

describe('routes/first-time/eligibility/claim/bank-account-details', function () {
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

  describe('GET /first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function () {
    it('should respond with a 200', function (done) {
      request
        .get(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(200)
        .end(done)
    })
  })

  describe('POST /first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function () {
    it('should respond with a 302', function (done) {
      var stubInsert = sinon.stub(bankAccountDetails, 'insert').resolves(1)
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .send(VALID_DATA)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(stubInsert.calledOnce).to.be.true
          done()
        })
    })

    it('should respond with a 400 if validation fails', function (done) {
      validationErrors = { 'AccountNumber': '', 'SortCode': '' }
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(400)
        .end(done)
    })

    it('should redirect to /first-time/:dob/:relationship/:journeyAssistance', function (done) {
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .send(VALID_DATA)
        .expect('location', '/application-submitted/' + reference)
        .end(done)
    })
  })
})
