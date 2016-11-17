const supertest = require('supertest')
const proxyquire = require('proxyquire')
const express = require('express')
const expect = require('chai').expect
const mockViewEngine = require('../../../mock-view-engine')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const sinon = require('sinon')
require('sinon-bluebird')

var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/bank-account-details', function () {
  const REFERENCE = 'V123456'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const CLAIMID = '1'
  const ROUTE = `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/bank-account-details`

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
      '../../../../../../app/routes/apply/eligibility/claim/bank-account-details', {
        '../../../../services/domain/bank-account-details': stubBankAccountDetails,
        '../../../../services/data/insert-bank-account-details-for-claim': stubInsertBankAccountDetailsForClaim,
        '../../../../services/data/submit-first-time-claim': stubSubmitFirstTimeClaim,
        '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
      })

    var app = express()
    app.use(bodyParser.json())
    app.use(cookieParser())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function () {
      return request
        .get(ROUTE)
        .expect(200)
        .expect(function () {
          expect(urlValidatorCalled).to.be.true
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should respond with a 302', function () {
      var newBankAccountDetails = {}
      stubBankAccountDetails.returns(newBankAccountDetails)
      stubInsertBankAccountDetailsForClaim.resolves()
      stubSubmitFirstTimeClaim.resolves()

      return request
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function (response) {
          expect(urlValidatorCalled).to.be.true
          sinon.assert.calledWith(stubBankAccountDetails, VALID_DATA.AccountNumber, VALID_DATA.SortCode)
          sinon.assert.calledWith(stubInsertBankAccountDetailsForClaim, REFERENCE, ELIGIBILITYID, CLAIMID, newBankAccountDetails)
          sinon.assert.calledWith(stubSubmitFirstTimeClaim, REFERENCE, ELIGIBILITYID, CLAIMID, undefined)
          expect(response.headers['location']).to.be.equal(`/application-submitted/${REFERENCE}`)
        })
    })

    it('should use assisted digital cookie value', function () {
      var assistedDigitalCaseWorker = 'a@b.com'
      stubBankAccountDetails.returns({})
      stubInsertBankAccountDetailsForClaim.resolves()
      stubSubmitFirstTimeClaim.resolves()

      return request
        .post(ROUTE)
        .send(VALID_DATA)
        .set('Cookie', [`apvs-assisted-digital=${assistedDigitalCaseWorker}`])
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubSubmitFirstTimeClaim, REFERENCE, ELIGIBILITYID, CLAIMID, assistedDigitalCaseWorker)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      stubBankAccountDetails.throws(new ValidationError({ 'firstName': {} }))
      return request
        .post(ROUTE)
        .expect(400)
    })
  })
})
