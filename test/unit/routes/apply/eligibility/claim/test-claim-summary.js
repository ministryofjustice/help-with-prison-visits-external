const supertest = require('supertest')
const sinon = require('sinon')
const ValidationError = require('../../../../../../app/services/errors/validation-error')
const routeHelper = require('../../../../../helpers/routes/route-helper')

const CLAIM_EXPENSE_ID = '1234'
const CLAIM_DOCUMENT_ID = '123'
const FILEPATH_RESULT = { path: 'test/resources/testfile.txt', name: 'testfile.txt' }

const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MTU0Ljk4OTM4MzMzMiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1MzQ0MTE3OGJiYjU0NGE3MGZhOCIsImRlY3J5cHRlZFJlZiI6IlkyVjZHQ00iLCJjbGFpbVR5cGUiOiJmaXJzdC10aW1lIiwiYWR2YW5jZU9yUGFzdCI6InBhc3QiLCJjbGFpbUlkIjoxM30=']

const COOKIES_EXPIRED = ['apvs-start-application=']
const ROUTE = '/apply/eligibility/claim/summary'
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

jest.mock(
  '../../../../services/validators/url-path-validator',
  () => urlPathValidatorStub
);

jest.mock('../../../../services/data/get-claim-summary', () => getClaimSummaryStub);
jest.mock('../../../../services/domain/claim-summary', () => claimSummaryStub);
jest.mock('../../../../services/aws-helper', () => awsHelperStub);
jest.mock('../../../helpers/claim-summary-helper', () => claimSummaryHelperStub);

describe('routes/apply/eligibility/claim/claim-summary', function () {
  let app
  let awsStub

  let urlPathValidatorStub
  let getClaimSummaryStub
  let claimSummaryStub
  let claimSummaryHelperStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    getClaimSummaryStub = sinon.stub()
    claimSummaryStub = sinon.stub()
    claimSummaryHelperStub = sinon.stub()
    awsStub = function () {
      return {
        download: sinon.stub().resolves(FILEPATH_RESULT.path)
      }
    }

    const awsHelperStub = {
      AWSHelper: awsStub
    }

    const route = require('../../../../../../app/routes/apply/eligibility/claim/claim-summary')

    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 200', function () {
      getClaimSummaryStub.resolves(CLAIM)
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })

    it('should respond with a 500 if promise rejects.', function () {
      getClaimSummaryStub.rejects()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 302 to payment details', function () {
      getClaimSummaryStub.resolves(CLAIM)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', '/apply/eligibility/claim/bank-payment-details?isAdvance=false')
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 400 if validation errors', function () {
      getClaimSummaryStub.resolves(CLAIM)
      claimSummaryStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects.', function () {
      getClaimSummaryStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`GET ${VIEW_DOCUMENT_ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
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
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 302', function () {
      const removeExpenseAndDocument = sinon.stub(claimSummaryHelperStub, 'removeExpenseAndDocument').resolves()
      return supertest(app)
        .post(REMOVE_EXPENSE_ROUTE)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', ROUTE);
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
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to claim summary', function () {
      const removeDocument = sinon.stub(claimSummaryHelperStub, 'removeDocument').resolves()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.assert.calledWith(removeDocument, CLAIM_DOCUMENT_ID)
        })
        .expect('location', ROUTE);
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to file upload', function () {
      const removeDocument = sinon.stub(claimSummaryHelperStub, 'removeDocument').resolves()
      return supertest(app)
        .post(REMOVE_DOCUMENT_ROUTE)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.assert.calledWith(removeDocument, CLAIM_DOCUMENT_ID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION`);
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to file upload', function () {
      const removeDocument = sinon.stub(claimSummaryHelperStub, 'removeDocument').resolves()
      const claimExpenseParam = '&claimExpenseId=1'
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}${claimExpenseParam}`)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.assert.calledWith(removeDocument, CLAIM_DOCUMENT_ID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION${claimExpenseParam}`);
    })

    it('should respond with a 500 if promise rejects.', function () {
      sinon.stub(claimSummaryHelperStub, 'removeDocument').rejects()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(500)
    })
  })
})
