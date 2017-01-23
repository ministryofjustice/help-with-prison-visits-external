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
const FILEPATH_RESULT = { path: 'test/resources/testfile.txt', name: 'testfile.txt' }

const ROUTE = `/apply/${CLAIM_TYPE}/eligibility/${REFERENCEID}/claim/${CLAIMID}/summary`
const VIEW_DOCUMENT_ROUTE = `${ROUTE}/view-document/${CLAIMDOCUMENTID}`
const REMOVE_EXPENSE_ROUTE = `${ROUTE}/remove-expense/${CLAIMEXPENSEID}?claimDocumentId=${CLAIMDOCUMENTID}`
const REMOVE_DOCUMENT_ROUTE = `${ROUTE}/remove-document/${CLAIMDOCUMENTID}?document=VISIT_CONFIRMATION`

const CLAIM = {
  claim: {
    visitConfirmation: '',
    Benefit: '',
    benefitDocument: [],
    IsAdvanceClaim: false
  }
}

describe('routes/apply/eligibility/claim/claim-summary', function () {
  var app

  var urlPathValidatorStub
  var getClaimSummaryStub
  var claimSummaryStub
  var claimSummaryHelperStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    getClaimSummaryStub = sinon.stub()
    claimSummaryStub = sinon.stub()
    claimSummaryHelperStub = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/claim-summary', {
        '../../../../services/validators/url-path-validator': urlPathValidatorStub,
        '../../../../services/data/get-claim-summary': getClaimSummaryStub,
        '../../../../services/domain/claim-summary': claimSummaryStub,
        '../../../helpers/claim-summary-helper': claimSummaryHelperStub
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
      getClaimSummaryStub.resolves(CLAIM)
      return supertest(app)
        .get(ROUTE)
        .expect(200)
        .expect(function () {
          getClaimSummaryStub.calledWith(CLAIMID, CLAIM_TYPE)
        })
    })

    it('should respond with a 500 if promise rejects.', function () {
      getClaimSummaryStub.rejects()
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
      getClaimSummaryStub.resolves(CLAIM)
      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect(function () {
          getClaimSummaryStub.calledWith(CLAIMID, CLAIM_TYPE)
          sinon.assert.calledOnce(claimSummaryStub)
        })
        .expect('location', `/apply/${CLAIM_TYPE}/eligibility/${REFERENCEID}/claim/${CLAIMID}/bank-account-details?isAdvance=false`)
    })

    it('should respond with a 400 if validation errors', function () {
      getClaimSummaryStub.resolves(CLAIM)
      claimSummaryStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects.', function () {
      getClaimSummaryStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })

  describe(`GET ${VIEW_DOCUMENT_ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond respond with 200 if valid path entered', function () {
      sinon.stub(claimSummaryHelperStub, 'getDocumentFilePath').resolves(FILEPATH_RESULT)
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .expect(200)
    })

    it('should respond with 500 if invalid path provided', function () {
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .expect(500)
    })
  })

  describe(`POST ${REMOVE_EXPENSE_ROUTE}`, function () {
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
          sinon.stub(claimSummaryHelperStub, 'removeExpenseAndDocument').calledWith(CLAIMID, CLAIMEXPENSEID, CLAIMDOCUMENTID)
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 500 if promise rejects.', function () {
      sinon.stub(claimSummaryHelperStub, 'removeExpenseAndDocument').rejects()
      return supertest(app)
        .post(REMOVE_EXPENSE_ROUTE)
        .expect(500)
    })
  })

  describe(`POST ${REMOVE_DOCUMENT_ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to claim summary', function () {
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(302)
        .expect(function () {
          sinon.stub(claimSummaryHelperStub, 'removeDocument').calledWith(CLAIMDOCUMENTID)
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to file upload', function () {
      return supertest(app)
        .post(REMOVE_DOCUMENT_ROUTE)
        .expect(302)
        .expect(function () {
          sinon.stub(claimSummaryHelperStub, 'removeDocument').calledWith(CLAIMDOCUMENTID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION`)
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to file upload', function () {
      var claimExpenseParam = '&claimExpenseId=1'
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}${claimExpenseParam}`)
        .expect(302)
        .expect(function () {
          sinon.stub(claimSummaryHelperStub, 'removeDocument').calledWith(CLAIMDOCUMENTID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION${claimExpenseParam}`)
    })

    it('should respond with a 500 if promise rejects.', function () {
      sinon.stub(claimSummaryHelperStub, 'removeDocument').rejects()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(500)
    })
  })
})
