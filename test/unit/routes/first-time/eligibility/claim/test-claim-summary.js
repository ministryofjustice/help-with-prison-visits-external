const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const express = require('express')
const expect = require('chai').expect
const mockViewEngine = require('../../../mock-view-engine')
const bodyParser = require('body-parser')
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

  beforeEach(function () {
    getClaimSummary = sinon.stub().resolves()
    removeClaimExpense = sinon.stub().resolves()

    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/claim-summary', {
        '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true },
        '../../../../services/data/get-claim-summary': getClaimSummary,
        '../../../../services/data/remove-claim-expense': removeClaimExpense
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
