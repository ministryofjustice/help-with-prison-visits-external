var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
const expect = require('chai').expect
var mockViewEngine = require('../../../mock-view-engine')
var bodyParser = require('body-parser')
const sinon = require('sinon')
require('sinon-bluebird')
var reference = 'V123456'
var claimId = '1'
var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/first-time/eligibility/claim/bank-account-details', function () {
  var request
  var stubBankAccountDetails
  var stubInsertBankAccountDetailsForClaim
  var urlValidatorCalled
  const VALID_DATA = {
    'AccountNumber': '12345678',
    'SortCode': '123456'
  }

  beforeEach(function () {
    stubBankAccountDetails = sinon.stub()
    stubInsertBankAccountDetailsForClaim = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/bank-account-details', {
        '../../../../services/domain/bank-account-details': stubBankAccountDetails,
        '../../../../services/data/insert-bank-account-details-for-claim': stubInsertBankAccountDetailsForClaim,
        '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
      })

    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe('GET /first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function () {
    it('should respond with a 200', function (done) {
      request
        .get(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })

  describe('POST /first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function () {
    it('should respond with a 302', function (done) {
      var newBankAccountDetails = {}
      stubBankAccountDetails.returns(newBankAccountDetails)
      stubInsertBankAccountDetailsForClaim.resolves(1)

      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .send(VALID_DATA)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(stubBankAccountDetails.calledWithExactly(VALID_DATA.AccountNumber, VALID_DATA.SortCode)).to.be.true
          expect(stubInsertBankAccountDetailsForClaim.calledWithExactly(claimId, newBankAccountDetails)).to.be.true
          expect(response.headers['location']).to.be.equal('/application-submitted/' + reference)
          done()
        })
    })

    it('should respond with a 400 if validation fails', function (done) {
      stubBankAccountDetails.throws(new ValidationError({ 'firstName': {} }))
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(400)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })
})
