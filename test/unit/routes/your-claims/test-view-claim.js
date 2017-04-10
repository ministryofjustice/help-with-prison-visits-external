const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const ValidationError = require('../../../../app/services/errors/validation-error')
const routeHelper = require('../../../helpers/routes/route-helper')
const encrypt = require('../../../../app/services/helpers/encrypt')
require('sinon-bluebird')

const COOKIES = [ 'apvs-start-already-registered=eyJkb2JFbmNvZGVkIjoiMTEzNzI1MTIyIiwiZW5jcnlwdGVkUmVmIjoiNGIyNjExMWRjZGM0M2EifQ==' ]
const REFERENCE = 'APVS123'
const ENCRYPTED_REFERENCE = encrypt(REFERENCE)
const ELIGIBILITY_ID = '1234'
const DECODED_DOB = '1990-10-10'
const CLAIMID = '1'
const CLAIM_DOCUMENT_ID = '123'
const CLAIM_EXPENSE_ID = '12345'
const VALID_FILEPATH_RESULT = { 'Filepath': 'test/resources/testfile.txt' }
const INVALID_FILEPATH_RESULT = 'invalid filepath'
const CLAIM = {
  claim: {
    EligibilityId: ELIGIBILITY_ID,
    visitConfirmation: '',
    Benefit: '',
    benefitDocument: []
  }
}

const ROUTE = `/your-claims/${CLAIMID}`
const VIEW_DOCUMENT_ROUTE = `${ROUTE}/view-document/${CLAIM_DOCUMENT_ID}`
const REMOVE_DOCUMENT_ROUTE = `${ROUTE}/remove-document/${CLAIM_DOCUMENT_ID}?document=VISIT_CONFIRMATION&eligibilityId=${ELIGIBILITY_ID}`

describe('routes/apply/eligibility/claim/view-claim', function () {
  var app

  var urlPathValidatorStub
  var getViewClaimStub
  var getClaimDocumentFilePathStub
  var viewClaimDomainObjectStub
  var submitUpdateStub
  var removeClaimDocumentStub
  var decryptStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    getViewClaimStub = sinon.stub()
    getClaimDocumentFilePathStub = sinon.stub()
    viewClaimDomainObjectStub = sinon.stub()
    submitUpdateStub = sinon.stub()
    removeClaimDocumentStub = sinon.stub()
    decryptStub = sinon.stub()

    var route = proxyquire(
      '../../../../app/routes/your-claims/view-claim', {
        '../../services/validators/url-path-validator': urlPathValidatorStub,
        '../../services/data/get-view-claim': getViewClaimStub,
        '../../services/data/get-claim-document-file-path': getClaimDocumentFilePathStub,
        '../../services/domain/view-claim': viewClaimDomainObjectStub,
        '../../services/data/submit-update': submitUpdateStub,
        '../../services/data/remove-claim-document': removeClaimDocumentStub,
        '../../services/helpers/decrypt': decryptStub
      })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200', function () {
      decryptStub.returns(REFERENCE)
      getViewClaimStub.resolves(CLAIM)
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          sinon.assert.calledWith(decryptStub, ENCRYPTED_REFERENCE)
          sinon.assert.calledWith(getViewClaimStub, CLAIMID, REFERENCE, DECODED_DOB)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302', function () {
      decryptStub.returns(REFERENCE)
      submitUpdateStub.resolves()
      getViewClaimStub.resolves(CLAIM)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(decryptStub, ENCRYPTED_REFERENCE)
          sinon.assert.calledWith(getViewClaimStub, CLAIMID, REFERENCE, DECODED_DOB)
          sinon.assert.calledOnce(viewClaimDomainObjectStub)
        })
        .expect('location', `/your-claims/${CLAIMID}?updated=true`)
    })

    it('should respond with a 400 if validation errors', function () {
      getViewClaimStub.resolves(CLAIM)
      viewClaimDomainObjectStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects.', function () {
      getViewClaimStub.resolves(CLAIM)
      viewClaimDomainObjectStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`GET ${VIEW_DOCUMENT_ROUTE}`, function () {
    it('should respond respond with 200 if valid path entered', function () {
      getClaimDocumentFilePathStub.resolves(VALID_FILEPATH_RESULT)
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect('content-length', '4')
    })

    it('should respond with 500 if invalid path provided', function () {
      getClaimDocumentFilePathStub.resolves(INVALID_FILEPATH_RESULT)
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`POST ${REMOVE_DOCUMENT_ROUTE}`, function () {
    it('should respond with a 302 and redirect to file upload if removal of a single page document succeeds', function () {
      removeClaimDocumentStub.resolves()
      return supertest(app)
        .post(REMOVE_DOCUMENT_ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(removeClaimDocumentStub, CLAIM_DOCUMENT_ID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION&eligibilityId=${ELIGIBILITY_ID}`)
    })

    it('should respond with a 302 and redirect to view claim if removal of a multi page document succeeds', function () {
      removeClaimDocumentStub.resolves()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(removeClaimDocumentStub, CLAIM_DOCUMENT_ID)
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 302 and redirect to the file upload page if with claimExpenseId set if one was sent.', function () {
      removeClaimDocumentStub.resolves()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&claimExpenseId=${CLAIM_EXPENSE_ID}`)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(removeClaimDocumentStub, CLAIM_DOCUMENT_ID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION&claimExpenseId=${CLAIM_EXPENSE_ID}&eligibilityId=${ELIGIBILITY_ID}`)
    })

    it('should respond with a 500 if promise rejects', function () {
      removeClaimDocumentStub.rejects()
      return supertest(app)
        .post(REMOVE_DOCUMENT_ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
