const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const ValidationError = require('../../../../../../app/services/errors/validation-error')
const routeHelper = require('../../../../../helpers/routes/route-helper')
require('sinon-bluebird')

const CLAIM_TYPE = 'first-time'
const REFERENCE = 'V123456'
const ELIGIBILITY_ID = '1234'
const REFERENCE_ID = `${REFERENCE}-${ELIGIBILITY_ID}`
const CLAIM_ID = '1'
const CLAIM_EXPENSE_ID = '1234'
const CLAIM_DOCUMENT_ID = '123'
const FILEPATH_RESULT = { path: 'test/resources/testfile.txt', name: 'testfile.txt' }

const ROUTE = `/apply/${CLAIM_TYPE}/eligibility/${REFERENCE_ID}/claim/${CLAIM_ID}/summary`
const VIEW_DOCUMENT_ROUTE = `${ROUTE}/view-document/${CLAIM_DOCUMENT_ID}`
const REMOVE_EXPENSE_ROUTE = `${ROUTE}/remove-expense/${CLAIM_EXPENSE_ID}?claimDocumentId=${CLAIM_DOCUMENT_ID}`
const REMOVE_DOCUMENT_ROUTE = `${ROUTE}/remove-document/${CLAIM_DOCUMENT_ID}?document=VISIT_CONFIRMATION`

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
  var configStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    getClaimSummaryStub = sinon.stub()
    claimSummaryStub = sinon.stub()
    claimSummaryHelperStub = sinon.stub()
    configStub = {PAYOUT_FEATURE_TOGGLE: 'false'}

    var route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/claim-summary', {
        '../../../../services/validators/url-path-validator': urlPathValidatorStub,
        '../../../../services/data/get-claim-summary': getClaimSummaryStub,
        '../../../../services/domain/claim-summary': claimSummaryStub,
        '../../../helpers/claim-summary-helper': claimSummaryHelperStub,
        '../../../../../config': configStub
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

    it('should respond with a 302 to bank details', function () {
      getClaimSummaryStub.resolves(CLAIM)
      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect('location', `/apply/${CLAIM_TYPE}/eligibility/${REFERENCE_ID}/claim/${CLAIM_ID}/bank-account-details?isAdvance=false`)
    })

    it('should respond with a 302 to payment details and declaration', function () {
      configStub.PAYOUT_FEATURE_TOGGLE = 'true'
      getClaimSummaryStub.resolves(CLAIM)
      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect('location', `/apply/${CLAIM_TYPE}/eligibility/${REFERENCE_ID}/claim/${CLAIM_ID}/payment-details-and-declaration?isAdvance=false`)
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

    it('should respond with a 302', function () {
      var removeExpenseAndDocument = sinon.stub(claimSummaryHelperStub, 'removeExpenseAndDocument').resolves()
      return supertest(app)
        .post(REMOVE_EXPENSE_ROUTE)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(removeExpenseAndDocument)
          sinon.assert.calledWith(removeExpenseAndDocument, CLAIM_ID, CLAIM_EXPENSE_ID, CLAIM_DOCUMENT_ID)
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
      var removeDocument = sinon.stub(claimSummaryHelperStub, 'removeDocument').resolves()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(removeDocument)
          sinon.assert.calledWith(removeDocument, CLAIM_DOCUMENT_ID)
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to file upload', function () {
      var removeDocument = sinon.stub(claimSummaryHelperStub, 'removeDocument').resolves()
      return supertest(app)
        .post(REMOVE_DOCUMENT_ROUTE)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(removeDocument)
          sinon.assert.calledWith(removeDocument, CLAIM_DOCUMENT_ID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION`)
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to file upload', function () {
      var removeDocument = sinon.stub(claimSummaryHelperStub, 'removeDocument').resolves()
      var claimExpenseParam = '&claimExpenseId=1'
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}${claimExpenseParam}`)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(removeDocument)
          sinon.assert.calledWith(removeDocument, CLAIM_DOCUMENT_ID)
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
