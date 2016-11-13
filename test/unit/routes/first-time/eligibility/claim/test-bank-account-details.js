var supertest = require('supertest')
var proxyquire = require('proxyquire')
var express = require('express')
const expect = require('chai').expect
var mockViewEngine = require('../../../mock-view-engine')
var bodyParser = require('body-parser')
const sinon = require('sinon')
require('sinon-bluebird')

var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/first-time/eligibility/claim/bank-account-details', function () {
  const REFERENCE = 'V123456'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const CLAIM_ID = '1'
  const ROUTE = `/first-time/eligibility/${REFERENCEID}/claim/${CLAIM_ID}/bank-account-details`

  var request
  var stubBankAccountDetails
  var stubInsertBankAccountDetailsForClaim
  var stubSubmitFirstTimeClaim
  var urlValidatorCalled
  const VALID_DATA = {
    'AccountNumber': '12345678',
    'SortCode': '123456'
  }

  beforeEach(function () {
    stubBankAccountDetails = sinon.stub()
    stubInsertBankAccountDetailsForClaim = sinon.stub()
    stubSubmitFirstTimeClaim = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/bank-account-details', {
        '../../../../services/domain/bank-account-details': stubBankAccountDetails,
        '../../../../services/data/insert-bank-account-details-for-claim': stubInsertBankAccountDetailsForClaim,
        '../../../../services/data/submit-first-time-claim': stubSubmitFirstTimeClaim,
        '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
      })

    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function (done) {
      request
        .get(ROUTE)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should respond with a 302', function (done) {
      var newBankAccountDetails = {}
      stubBankAccountDetails.returns(newBankAccountDetails)
      stubInsertBankAccountDetailsForClaim.resolves()
      stubSubmitFirstTimeClaim.resolves()

      request
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          sinon.assert.calledWith(stubBankAccountDetails, VALID_DATA.AccountNumber, VALID_DATA.SortCode)
          sinon.assert.calledWith(stubInsertBankAccountDetailsForClaim, REFERENCE, ELIGIBILITYID, CLAIM_ID, newBankAccountDetails)
          sinon.assert.calledWith(stubSubmitFirstTimeClaim, REFERENCE, ELIGIBILITYID, CLAIM_ID)
          expect(response.headers['location']).to.be.equal(`/application-submitted/${REFERENCEID}`)
          done()
        })
    })

    it('should respond with a 400 if validation fails', function (done) {
      stubBankAccountDetails.throws(new ValidationError({ 'firstName': {} }))
      request
        .post(ROUTE)
        .expect(400)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })
})
