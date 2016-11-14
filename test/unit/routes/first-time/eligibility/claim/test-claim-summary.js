const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const express = require('express')
const expect = require('chai').expect
const mockViewEngine = require('../../../mock-view-engine')
const bodyParser = require('body-parser')
const ValidationError = require('../../../../../../app/services/errors/validation-error')
require('sinon-bluebird')

const REFERENCE = 'V123456'
const ELIGIBILITYID = '1234'
const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
const CLAIMID = '1'
const CLAIMEXPENSEID = '1234'

describe('routes/first-time/eligibility/claim/claim-summary', function () {
  var request
  var urlValidatorCalled
  var getClaimSummary
  var removeClaimExpense
  var claimSummaryStub

  beforeEach(function () {
    getClaimSummary = sinon.stub().resolves({
      claim: {
        visitConfirmation: ''
      }
    })
    removeClaimExpense = sinon.stub().resolves()
    claimSummaryStub = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/claim-summary', {
        '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true },
        '../../../../services/data/get-claim-summary': getClaimSummary,
        '../../../../services/data/remove-claim-expense': removeClaimExpense,
        '../../../../services/domain/claim-summary': claimSummaryStub
      })

    var app = express()
    app.use(bodyParser.json())
    mockViewEngine(app, '../../../app/views')
    route(app)
    request = supertest(app)
    urlValidatorCalled = false
  })

  describe('GET /first-time/eligibility/:referenceId/claim/:claimId/summary', function () {
    it('should respond with a 200', function (done) {
      request
        .get(`/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary`)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(getClaimSummary.calledWith(CLAIMID)).to.be.true
          done()
        })
    })
  })

  describe('POST /first-time/eligibility/:referenceId/claim/:claimId/summary', function () {
    it('should respond with a 302', function (done) {
      request
        .post(`/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(response.headers['location']).to.be.equal(`/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/bank-account-details`)
          done()
        })
    })

    it('should respond with a 400 if validation errors', function (done) {
      claimSummaryStub.throws(new ValidationError())
      request
        .post(`/first-time/eligibility/${reference}/claim/${claimId}/summary`)
        .expect(400)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          done()
        })
    })
  })

  describe('POST /first-time/eligibility/:referenceId/claim/:claimId/summary/remove/:claimExpenseId', function () {
    it('should respond with a 302 and call removeClaimExpense', function (done) {
      request
        .post(`/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary/remove/${CLAIMEXPENSEID}`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(removeClaimExpense.calledWith(CLAIMID, CLAIMEXPENSEID)).to.be.true
          expect(response.headers['location']).to.be.equal(`/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary`)
          done()
        })
    })
  })
})
