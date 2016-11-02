const supertest = require('supertest')
const proxyquire = require('proxyquire')
const express = require('express')
const expect = require('chai').expect
const mockViewEngine = require('../../../mock-view-engine')
const bodyParser = require('body-parser')
const sinon = require('sinon')
require('sinon-bluebird')
const ValidationError = require('../../../../../../app/services/errors/validation-error')
const UrlPathValidator = require('../../../../../../app/services/validators/url-path-validator')

const reference = 'V123456'
const claimId = '1'

describe('routes/first-time/eligibility/claim/bank-account-details', function () {
  var request
  var stubBankAccountDetails
  var stubInsertBankAccountDetailsForClaim
  var stubSubmitFirstTimeClaim
  const VALID_DATA = {
    'AccountNumber': '12345678',
    'SortCode': '123456'
  }

  var sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    stubBankAccountDetails = sinon.stub()
    stubInsertBankAccountDetailsForClaim = sinon.stub()
    stubSubmitFirstTimeClaim = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/bank-account-details', {
        '../../../../services/domain/bank-account-details': stubBankAccountDetails,
        '../../../../services/data/insert-bank-account-details-for-claim': stubInsertBankAccountDetailsForClaim,
        '../../../../services/data/submit-first-time-claim': stubSubmitFirstTimeClaim
      })

    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('GET /first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function () {
    it('should respond with a 200', function (done) {
      request
        .get(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(200)
        .end(function (error) {
          expect(error).to.be.null
          done()
        })
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .get(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })

  describe('POST /first-time-claim/eligibility/:reference/claim/:claimId/bank-account-details', function () {
    it('should respond with a 302', function (done) {
      var newBankAccountDetails = {}
      stubBankAccountDetails.returns(newBankAccountDetails)
      stubInsertBankAccountDetailsForClaim.resolves()
      stubSubmitFirstTimeClaim.resolves()

      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .send(VALID_DATA)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(stubBankAccountDetails.calledWithExactly(VALID_DATA.AccountNumber, VALID_DATA.SortCode)).to.be.true
          expect(stubInsertBankAccountDetailsForClaim.calledWithExactly(claimId, newBankAccountDetails)).to.be.true
          expect(stubSubmitFirstTimeClaim.calledWithExactly(reference, claimId)).to.be.true
          expect(response.headers['location']).to.be.equal('/application-submitted/' + reference)
          done()
        })
    })

    it('should respond with a 400 if validation fails', function (done) {
      stubBankAccountDetails.throws(new ValidationError({ 'firstName': {} }))
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(400)
        .end(function (error) {
          expect(error).to.be.null
          done()
        })
    })

    it('should call the URL Path Validator ', function () {
      stubBankAccountDetails.throws(new ValidationError({ 'firstName': {} }))
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })
})
