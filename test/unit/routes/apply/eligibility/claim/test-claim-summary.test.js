const supertest = require('supertest')
const ValidationError = require('../../../../../../app/services/errors/validation-error')
const routeHelper = require('../../../../../helpers/routes/route-helper')

const CLAIM_EXPENSE_ID = '1234'
const CLAIM_DOCUMENT_ID = '123'
const FILEPATH_RESULT = { path: 'test/resources/testfile.txt', name: 'testfile.txt' }

const COOKIES = [
  'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MTU0Ljk4OTM4MzMzMiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1MzQ0MTE3OGJiYjU0NGE3MGZhOCIsImRlY3J5cHRlZFJlZiI6IlkyVjZHQ00iLCJjbGFpbVR5cGUiOiJmaXJzdC10aW1lIiwiYWR2YW5jZU9yUGFzdCI6InBhc3QiLCJjbGFpbUlkIjoxM30=',
]

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
    IsAdvanceClaim: false,
  },
}

describe('routes/apply/eligibility/claim/claim-summary', () => {
  let app

  const mockUrlPathValidator = jest.fn()
  const mockGetClaimSummary = jest.fn()
  const mockClaimSummary = jest.fn()
  const mockDownload = jest.fn()
  // const mockAws = jest.fn()
  const mockGetDocumentFilePath = jest.fn()
  const mockRemoveExpenseAndDocument = jest.fn()
  const mockRemoveDocument = jest.fn()
  let mockAwsHelper

  beforeEach(() => {
    // mockAws.mockReturnValue({
    //   download: mockDownload.mockResolvedValue(FILEPATH_RESULT.path),
    // })

    // mockAwsHelper = {
    //   AWSHelper: mockAws,
    // }

    jest.mock('../../../../app/services/aws-helper', () => {
      return jest.fn().mockImplementation(() => ({
        download: mockDownload.mockResolvedValue(FILEPATH_RESULT.path),
      }))
    })

    jest.mock('../../../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)
    jest.mock('../../../../../../app/services/data/get-claim-summary', () => mockGetClaimSummary)
    jest.mock('../../../../../../app/services/domain/claim-summary', () => mockClaimSummary)
    jest.mock('../../../../../../app/services/aws-helper', () => mockAwsHelper)

    jest.mock('../../../../../../app/routes/helpers/claim-summary-helper', () => {
      const originalModule = jest.requireActual('../../../../../../app/routes/helpers/claim-summary-helper')

      return {
        ...originalModule,
        getDocumentFilePath: mockGetDocumentFilePath,
        removeExpenseAndDocument: mockRemoveExpenseAndDocument,
        removeDocument: mockRemoveDocument,
      }
    })

    const route = require('../../../../../../app/routes/apply/eligibility/claim/claim-summary')

    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200', () => {
      mockGetClaimSummary.mockResolvedValue(CLAIM)
      return supertest(app).get(ROUTE).set('Cookie', COOKIES).expect(200)
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockGetClaimSummary.mockRejectedValue()
      return supertest(app).get(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })

  describe(`POST ${ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 to payment details', () => {
      mockGetClaimSummary.mockResolvedValue(CLAIM)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', '/apply/eligibility/claim/bank-payment-details?isAdvance=false')
    })

    it('should redirect to date-of-birth error page if cookie is expired', () => {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 400 if validation errors', () => {
      mockGetClaimSummary.mockResolvedValue(CLAIM)
      mockClaimSummary.mockImplementation(() => {
        throw new ValidationError()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(400)
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockGetClaimSummary.mockRejectedValue()
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })

  describe(`GET ${VIEW_DOCUMENT_ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
      return supertest(app)
        .get(VIEW_DOCUMENT_ROUTE)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond respond with 200 if valid path entered', () => {
      mockGetDocumentFilePath.mockResolvedValue(FILEPATH_RESULT)
      return supertest(app).get(VIEW_DOCUMENT_ROUTE).expect(200)
    })

    it('should respond with 500 if invalid path provided', () => {
      return supertest(app).get(VIEW_DOCUMENT_ROUTE).expect(500)
    })
  })

  describe(`POST ${REMOVE_EXPENSE_ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
      return supertest(app)
        .post(REMOVE_EXPENSE_ROUTE)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302', () => {
      mockRemoveExpenseAndDocument.mockResolvedValue()
      return supertest(app)
        .post(REMOVE_EXPENSE_ROUTE)
        .expect(302)
        .expect(() => {
          expect(mockRemoveExpenseAndDocument).toHaveBeenCalledTimes(1)
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockRemoveExpenseAndDocument.mockRejectedValue()
      return supertest(app).post(REMOVE_EXPENSE_ROUTE).expect(500)
    })
  })

  describe(`POST ${REMOVE_DOCUMENT_ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to claim summary', () => {
      mockRemoveDocument.mockResolvedValue()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .expect(302)
        .expect(() => {
          expect(mockRemoveDocument).toHaveBeenCalledTimes(1)
          expect(mockRemoveDocument).toHaveBeenCalledWith(CLAIM_DOCUMENT_ID)
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to file upload', () => {
      mockRemoveDocument.mockResolvedValue()
      return supertest(app)
        .post(REMOVE_DOCUMENT_ROUTE)
        .expect(302)
        .expect(() => {
          expect(mockRemoveDocument).toHaveBeenCalledTimes(1)
          expect(mockRemoveDocument).toHaveBeenCalledWith(CLAIM_DOCUMENT_ID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION`)
    })

    it('should respond with a 302, call removeClaimDocument, and redirect to file upload', () => {
      mockRemoveDocument.mockResolvedValue()
      const claimExpenseParam = '&claimExpenseId=1'
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}${claimExpenseParam}`)
        .expect(302)
        .expect(() => {
          expect(mockRemoveDocument).toHaveBeenCalledTimes(1)
          expect(mockRemoveDocument).toHaveBeenCalledWith(CLAIM_DOCUMENT_ID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION${claimExpenseParam}`)
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockRemoveDocument.mockRejectedValue()
      return supertest(app).post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`).expect(500)
    })
  })
})
