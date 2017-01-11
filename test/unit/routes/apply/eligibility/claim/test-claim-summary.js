const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const expect = require('chai').expect
const ValidationError = require('../../../../../../app/services/errors/validation-error')
const routeHelper = require('../../../../../helpers/routes/route-helper')
require('sinon-bluebird')

const CLAIM_TYPE = 'first-time'
const REFERENCE = 'V123456'
const ELIGIBILITYID = '1234'
const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
const CLAIMID = '1'
const CLAIMEXPENSEID = '1234'
const CLAIMDOCUMENTID = '123'
const FILEPATH_RESULT = { 'Filepath': 'test/resources/testfile.txt' }

const ROUTE = `/apply/${CLAIM_TYPE}/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary`

describe('routes/apply/eligibility/claim/claim-summary', function () {
  var request
  var urlValidatorCalled
  var getClaimSummary
  var getClaimDocumentFilePath
  var claimSummaryDomainObjectStub
  var removeClaimExpense
  var removeClaimDocument

  beforeEach(function () {
    getClaimSummary = sinon.stub().resolves({
      claim: {
        visitConfirmation: '',
        Benefit: '',
        benefitDocument: [],
        IsAdvanceClaim: false
      }
    })
    getClaimDocumentFilePath = sinon.stub().resolves(FILEPATH_RESULT)
    claimSummaryDomainObjectStub = sinon.stub()
    removeClaimExpense = sinon.stub().resolves()
    removeClaimDocument = sinon.stub().resolves()

    var route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/claim-summary', {
        '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true },
        '../../../../services/data/get-claim-summary': getClaimSummary,
        '../../../../services/data/get-claim-document-file-path': getClaimDocumentFilePath,
        '../../../../services/domain/claim-summary': claimSummaryDomainObjectStub,
        '../../../../services/data/remove-claim-expense': removeClaimExpense,
        '../../../../services/data/remove-claim-document': removeClaimDocument
      })

    var app = routeHelper.buildApp(route)
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
          expect(getClaimSummary.calledWith(CLAIMID, CLAIM_TYPE)).to.be.true
          done()
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should respond with a 302', function (done) {
      request
        .post(ROUTE)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(getClaimSummary.calledWith(CLAIMID, CLAIM_TYPE)).to.be.true
          expect(claimSummaryDomainObjectStub.calledOnce, 'Should have called to check validation').to.be.true
          expect(response.headers['location']).to.be.equal(`/apply/${CLAIM_TYPE}/eligibility/${REFERENCEID}/claim/${CLAIMID}/bank-account-details?isAdvance=false`)
          done()
        })
    })

    it('should respond with a 400 if validation errors', function (done) {
      claimSummaryDomainObjectStub.throws(new ValidationError())
      request
        .post(ROUTE)
        .expect(400, done)
    })
  })

  describe(`GET ${ROUTE}/view-document/:claimDocumentId`, function () {
    it('should respond respond with 200 if valid path entered', function (done) {
      request
        .get(`${ROUTE}/view-document/${CLAIMDOCUMENTID}`)
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
        .get(`${ROUTE}/view-document/${CLAIMDOCUMENTID}`)
        .expect(500, done)
    })
  })

  describe(`POST ${ROUTE}/remove-expense/:claimExpenseId`, function () {
    it('should respond with a 302 and call removeClaimExpense and removeClaimDocument', function (done) {
      request
        .post(`${ROUTE}/remove-expense/${CLAIMEXPENSEID}?claimDocumentId=${CLAIMDOCUMENTID}`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(removeClaimExpense.calledWith(CLAIMID, CLAIMEXPENSEID)).to.be.true
          expect(removeClaimDocument.calledWith(CLAIMDOCUMENTID)).to.be.true
          expect(response.headers['location']).to.be.equal(ROUTE)
          done()
        })
    })
  })

  describe(`POST ${ROUTE}/remove-document/:claimDocumentId`, function () {
    it('should respond with a 302, call removeClaimDocument and redirect to file upload', function (done) {
      request
        .post(`${ROUTE}/remove-document/${CLAIMDOCUMENTID}?document=VISIT_CONFIRMATION`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(removeClaimDocument.calledWith(CLAIMDOCUMENTID)).to.be.true
          expect(response.headers['location']).to.be.equal(`/apply/${CLAIM_TYPE}/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary/file-upload?document=VISIT_CONFIRMATION`)
          done()
        })
    })

    it('should respond with a 302, call removeClaimDocument and redirect to claim summary', function (done) {
      request
        .post(`${ROUTE}/remove-document/${CLAIMDOCUMENTID}?document=VISIT_CONFIRMATION&multipage=true`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(removeClaimDocument.calledWith(CLAIMDOCUMENTID)).to.be.true
          expect(response.headers['location']).to.be.equal(ROUTE)
          done()
        })
    })
  })
})
