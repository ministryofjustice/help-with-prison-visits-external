const supertest = require('supertest')
const sinon = require('sinon')
const ValidationError = require('../../../../app/services/errors/validation-error')
const routeHelper = require('../../../helpers/routes/route-helper')

const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MjQ5LjM2NTU1LCJkZWNyeXB0ZWRSZWYiOiJRSFFDWFdaIiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyJ9']
const ELIGIBILITY_ID = '1234'
const CLAIMID = '1'
const CLAIM_DOCUMENT_ID = '123'
const CLAIM_EXPENSE_ID = '12345'
const VALID_FILEPATH_RESULT = { Filepath: 'test/resources/testfile.txt' }
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

jest.mock('../../services/validators/url-path-validator', () => urlPathValidatorStub);
jest.mock('../../services/data/get-view-claim', () => getViewClaimStub);

jest.mock(
  '../../services/data/get-claim-document-file-path',
  () => getClaimDocumentFilePathStub
);

jest.mock('../../services/domain/view-claim', () => viewClaimDomainObjectStub);
jest.mock('../../services/data/submit-update', () => submitUpdateStub);
jest.mock('../../services/data/remove-claim-document', () => removeClaimDocumentStub);
jest.mock('../../services/aws-helper', () => awsHelperStub);

describe('routes/apply/eligibility/claim/view-claim', function () {
  let app
  let awsStub

  let urlPathValidatorStub
  let getViewClaimStub
  let getClaimDocumentFilePathStub
  let viewClaimDomainObjectStub
  let submitUpdateStub
  let removeClaimDocumentStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    getViewClaimStub = sinon.stub()
    getClaimDocumentFilePathStub = sinon.stub()
    viewClaimDomainObjectStub = sinon.stub()
    submitUpdateStub = sinon.stub()
    removeClaimDocumentStub = sinon.stub()
    awsStub = function () {
      return {
        download: sinon.stub().resolves(VALID_FILEPATH_RESULT.Filepath)
      }
    }

    const awsHelperStub = {
      AWSHelper: awsStub
    }

    const route = require('../../../../app/routes/your-claims/view-claim')
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
      getViewClaimStub.resolves(CLAIM)
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 302', function () {
      submitUpdateStub.resolves()
      getViewClaimStub.resolves(CLAIM)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', `/your-claims/${CLAIMID}?updated=true`);
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
