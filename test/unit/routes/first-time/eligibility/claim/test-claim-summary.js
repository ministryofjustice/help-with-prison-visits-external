const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const expect = require('chai').expect
const ValidationError = require('../../../../../../app/services/errors/validation-error')
const routeHelper = require('../../../../../helpers/routes/route-helper')
require('sinon-bluebird')

const REFERENCE = 'V123456'
const ELIGIBILITYID = '1234'
const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
const CLAIMID = '1'
const CLAIMEXPENSEID = '1234'
const CLAIMDOCUMENTID = '123'
const FILEPATH_RESULT = { 'Filepath': 'test/resources/testfile.jpg' }

describe('routes/first-time/eligibility/claim/claim-summary', function () {
  var request
  var urlValidatorCalled
  var getClaimSummary
  var getClaimDocumentFilePath
  var removeClaimExpense
  var claimSummaryDomainObjectStub

  beforeEach(function () {
    getClaimSummary = sinon.stub().resolves({
      claim: {
        visitConfirmation: ''
      }
    })
    getClaimDocumentFilePath = sinon.stub().resolves(FILEPATH_RESULT)
    removeClaimExpense = sinon.stub().resolves()
    claimSummaryDomainObjectStub = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/first-time/eligibility/claim/claim-summary', {
        '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true },
        '../../../../services/data/get-claim-summary': getClaimSummary,
        '../../../../services/data/get-claim-document-file-path': getClaimDocumentFilePath,
        '../../../../services/data/remove-claim-expense': removeClaimExpense,
        '../../../../services/domain/claim-summary': claimSummaryDomainObjectStub
      })

    var app = routeHelper.buildApp(route)
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
          expect(getClaimSummary.calledWith(CLAIMID)).to.be.true
          expect(claimSummaryDomainObjectStub.calledOnce, 'Should have called to check validation').to.be.true
          expect(response.headers['location']).to.be.equal(`/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/bank-account-details`)
          done()
        })
    })

    it('should respond with a 400 if validation errors', function (done) {
      claimSummaryDomainObjectStub.throws(new ValidationError())
      request
        .post(`/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary`)
        .expect(400, done)
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

  describe('GET /first-time/eligibility/:referenceId/claim/:claimId/summary/viewFile/:claimDocumentId', function () {
    it('should respond respond with 200 if valid path entered', function (done) {
      request
        .get(`/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary/viewFile/${CLAIMDOCUMENTID}`)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(response.header['content-length']).to.equal('4')
          done()
        })
    })

    it('should respond with 500 if invalid path provided', function (done) {
      getClaimDocumentFilePath.resolves('invalid-filepath')
      request
        .get(`/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary/viewFile/${CLAIMDOCUMENTID}`)
        .expect(500, done)
    })
  })
})
