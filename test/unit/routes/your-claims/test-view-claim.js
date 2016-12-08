const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const expect = require('chai').expect
const ValidationError = require('../../../../app/services/errors/validation-error')
const routeHelper = require('../../../helpers/routes/route-helper')
require('sinon-bluebird')

const CLAIM_TYPE = 'first-time'
const REFERENCE = 'V123456'
const ELIGIBILITYID = '1234'
const DOB = '1990-10-10'
const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
const CLAIMID = '1'
const CLAIMDOCUMENTID = '123'
const FILEPATH_RESULT = { 'Filepath': 'test/resources/testfile.txt' }

const ROUTE = `/your-claims/${DOB}/${REFERENCE}/${CLAIMID}`

describe('routes/apply/eligibility/claim/claim-summary', function () {
  var request
  var urlValidatorCalled
  var getViewClaimStub
  var getClaimDocumentFilePath
  var viewClaimDomainObjectStub
  var submitUpdateStub
  var removeClaimDocument

  beforeEach(function () {
    getViewClaimStub = sinon.stub().resolves({
      claim: {
        EligibilityId: ELIGIBILITYID,
        visitConfirmation: '',
        Benefit: '',
        benefitDocument: []
      }
    })
    getClaimDocumentFilePath = sinon.stub().resolves(FILEPATH_RESULT)
    viewClaimDomainObjectStub = sinon.stub()
    submitUpdateStub = sinon.stub().resolves()
    removeClaimDocument = sinon.stub().resolves()

    var route = proxyquire(
      '../../../../app/routes/your-claims/view-claim', {
        '../../services/validators/url-path-validator': function () { urlValidatorCalled = true },
        '../../services/data/get-view-claim': getViewClaimStub,
        '../../services/data/get-claim-document-file-path': getClaimDocumentFilePath,
        '../../services/domain/view-claim': viewClaimDomainObjectStub,
        '../../services/data/submit-update': submitUpdateStub,
        '../../services/data/remove-claim-document': removeClaimDocument
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
          expect(getViewClaimStub.calledWith(CLAIMID, REFERENCE, DOB)).to.be.true
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
          expect(getViewClaimStub.calledWith(CLAIMID, REFERENCE, DOB)).to.be.true
          expect(viewClaimDomainObjectStub.calledOnce, 'Should have called to check validation').to.be.true
          expect(response.headers['location']).to.be.equal(`/application-updated/${REFERENCE}`)
          done()
        })
    })

    it('should respond with a 400 if validation errors', function (done) {
      viewClaimDomainObjectStub.throws(new ValidationError())
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

  describe(`POST ${ROUTE}/remove-document/:claimDocumentId`, function () {
    it('should respond with a 302, call removeClaimDocument and redirect to file upload', function (done) {
      request
        .post(`${ROUTE}/remove-document/${CLAIMDOCUMENTID}?document=VISIT_CONFIRMATION&eligibilityId=${ELIGIBILITYID}`)
        .expect(302)
        .end(function (error, response) {
          expect(error).to.be.null
          expect(urlValidatorCalled).to.be.true
          expect(removeClaimDocument.calledWith(CLAIMDOCUMENTID)).to.be.true
          expect(response.headers['location']).to.be.equal(`/your-claims/${DOB}/${REFERENCE}/${CLAIMID}/file-upload?document=VISIT_CONFIRMATION&eligibilityId=${ELIGIBILITYID}`)
          done()
        })
    })

    it('should respond with a 302, call removeClaimDocument and redirect to claim summary', function (done) {
      request
        .post(`${ROUTE}/remove-document/${CLAIMDOCUMENTID}?document=VISIT_CONFIRMATION&eligibilityId=${ELIGIBILITYID}&multipage=true`)
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
