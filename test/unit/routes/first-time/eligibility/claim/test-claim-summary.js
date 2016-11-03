const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const express = require('express')
const expect = require('chai').expect
const mockViewEngine = require('../../../mock-view-engine')
const bodyParser = require('body-parser')
require('sinon-bluebird')
const UrlPathValidator = require('../../../../../../app/services/validators/url-path-validator')

var reference = 'V123456'
var claimId = '1'
var claimExpenseId = '1234'

describe('routes/first-time/eligibility/claim/claim-summary', function () {
  var request
  var getIndividualClaimDetails
  var removeClaimExpense
  var sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    getIndividualClaimDetails = sinon.stub().resolves()
    removeClaimExpense = sinon.stub().resolves()

    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/claim-summary', {
        '../../../../services/data/get-individual-claim-details': getIndividualClaimDetails,
        '../../../../services/data/remove-claim-expense': removeClaimExpense
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

  describe('GET /first-time-claim/eligibility/:reference/claim/:claimId/summary', function () {
    it('should respond with a 200', function (done) {
      request
        .get(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary`)
        .expect(200)
        .end(function (error) {
          expect(error).to.be.null
          expect(getIndividualClaimDetails.calledWith(claimId)).to.be.true
          done()
        })
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      request
        .get(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })

  describe('POST /first-time-claim/eligibility/:reference/claim/:claimId/summary', function () {
    it('should respond with a 302', function (done) {
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(response.headers['location']).to.be.equal(`/first-time-claim/eligibility/${reference}/claim/${claimId}/bank-account-details`)
          done()
        })
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })

  describe('POST /first-time-claim/eligibility/:reference/claim/:claimId/summary/remove/:claimExpenseId', function () {
    it('should respond with a 302 and call removeClaimExpense', function (done) {
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary/remove/${claimExpenseId}`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(removeClaimExpense.calledWith(claimId, claimExpenseId)).to.be.true
          expect(response.headers['location']).to.be.equal(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary`)
          done()
        })
    })

    it('should call the URL Path Validator ', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      request
        .post(`/first-time-claim/eligibility/${reference}/claim/${claimId}/summary/remove/${claimExpenseId}`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })
  })
})
