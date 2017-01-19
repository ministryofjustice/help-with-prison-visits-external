const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
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
  var app

  var urlPathValidatorStub
  var getClaimSummary
  var getClaimDocumentFilePath
  var claimSummaryDomainObjectStub
  var removeClaimExpense
  var removeClaimDocument

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    getClaimSummary = sinon.stub().resolves({
      claim: {
        visitConfirmation: '',
        Benefit: '',
        benefitDocument: [],
        IsAdvanceClaim: false
      }
    })
    getClaimDocumentFilePath = sinon.stub()
    claimSummaryDomainObjectStub = sinon.stub()
    removeClaimExpense = sinon.stub().resolves()
    removeClaimDocument = sinon.stub().resolves()

    var route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/claim-summary', {
        '../../../../services/validators/url-path-validator': urlPathValidatorStub,
        '../../../../services/data/get-claim-summary': getClaimSummary,
        '../../../../services/data/get-claim-document-file-path': getClaimDocumentFilePath,
        '../../../../services/domain/claim-summary': claimSummaryDomainObjectStub,
        '../../../../services/data/remove-claim-expense': removeClaimExpense,
        '../../../../services/data/remove-claim-document': removeClaimDocument
      })

    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
        .expect(function () {
          getClaimSummary.calledWith(CLAIMID, CLAIM_TYPE)
        })
    })

    it('should respond with a 500 if promise rejects.', function () {
      getClaimSummary.rejects()
      return supertest(app)
        .get(ROUTE)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect(function () {
          getClaimSummary.calledWith(CLAIMID, CLAIM_TYPE)
          sinon.assert.calledOnce(claimSummaryDomainObjectStub)
        })
        .expect('location', `/apply/${CLAIM_TYPE}/eligibility/${REFERENCEID}/claim/${CLAIMID}/bank-account-details?isAdvance=false`)
    })

    it('should respond with a 400 if validation errors', function () {
      claimSummaryDomainObjectStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects.', function () {
      getClaimSummary.rejects()
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })

  describe(`GET ${ROUTE}/view-document/:claimDocumentId`, function () {
    const VIEW_DOCUMENT_ROUTE = `${ROUTE}/view-document/${CLAIMDOCUMENTID}`

    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond respond with 200 if valid path entered', function () {
      getClaimDocumentFilePath.resolves(FILEPATH_RESULT)
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .expect(200)
        .expect('content-length', '4')
    })

    it('should respond with 500 if invalid path provided', function () {
      getClaimDocumentFilePath.resolves('invalid-filepath')
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}/remove-expense/:claimExpenseId`, function () {
    const REMOVE_EXPENSE_ROUTE = `${ROUTE}/remove-expense/${CLAIMEXPENSEID}?claimDocumentId=${CLAIMDOCUMENTID}`

    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(REMOVE_EXPENSE_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 and call removeClaimExpense and removeClaimDocument', function () {
      return supertest(app)
        .post(REMOVE_EXPENSE_ROUTE)
        .expect(302)
        .expect(function () {
          removeClaimExpense.calledWith(CLAIMID, CLAIMEXPENSEID)
          removeClaimDocument.calledWith(CLAIMDOCUMENTID)
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 500 if promise rejects.', function () {
      removeClaimExpense.rejects()
      return supertest(app)
        .post(REMOVE_EXPENSE_ROUTE)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}/remove-document/:claimDocumentId`, function () {
    const REMOVE_DOCUMENT_ROUTE = `${ROUTE}/remove-document/${CLAIMDOCUMENTID}?document=VISIT_CONFIRMATION`

    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302, call removeClaimDocument and redirect to file upload', function () {
      return supertest(app)
        .post(REMOVE_DOCUMENT_ROUTE)
        .expect(302)
        .expect(function () {
          removeClaimDocument.calledWith(CLAIMDOCUMENTID)
        })
        .expect('location', `/apply/${CLAIM_TYPE}/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary/file-upload?document=VISIT_CONFIRMATION`)
    })

    it('should respond with a 302, call removeClaimDocument and redirect to claim summary', function () {
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(302)
        .expect(function () {
          removeClaimDocument.calledWith(CLAIMDOCUMENTID)
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 500 if promise rejects.', function () {
      removeClaimDocument.rejects()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(500)
    })
  })
})
