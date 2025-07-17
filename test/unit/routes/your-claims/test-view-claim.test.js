const supertest = require('supertest')
const ValidationError = require('../../../../app/services/errors/validation-error')
const routeHelper = require('../../../helpers/routes/route-helper')

const COOKIES = [
  'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MjQ5LjM2NTU1LCJkZWNyeXB0ZWRSZWYiOiJRSFFDWFdaIiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyJ9',
]
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
    benefitDocument: [],
  },
}

const ROUTE = `/your-claims/${CLAIMID}`
const VIEW_DOCUMENT_ROUTE = `${ROUTE}/view-document/${CLAIM_DOCUMENT_ID}`
const REMOVE_DOCUMENT_ROUTE = `${ROUTE}/remove-document/${CLAIM_DOCUMENT_ID}?document=VISIT_CONFIRMATION&eligibilityId=${ELIGIBILITY_ID}`

describe('routes/apply/eligibility/claim/view-claim', () => {
  let app

  const mockUrlPathValidator = jest.fn()
  const mockGetViewClaim = jest.fn()
  const mockGetClaimDocumentFilePath = jest.fn()
  const mockViewClaimDomainObject = jest.fn()
  const mockSubmitUpdate = jest.fn()
  const mockRemoveClaimDocument = jest.fn()
  const mockDownload = jest.fn()
  const mockAws = jest.fn()

  beforeEach(() => {
    mockAws.mockReturnValue({
      download: mockDownload.mockResolvedValue(VALID_FILEPATH_RESULT.Filepath),
    })

    const mockAwsHelper = {
      AWSHelper: mockAws,
    }

    jest.mock('../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)
    jest.mock('../../../../app/services/data/get-view-claim', () => mockGetViewClaim)
    jest.mock('../../../../app/services/data/get-claim-document-file-path', () => mockGetClaimDocumentFilePath)
    jest.mock('../../../../app/services/domain/view-claim', () => mockViewClaimDomainObject)
    jest.mock('../../../../app/services/data/submit-update', () => mockSubmitUpdate)
    jest.mock('../../../../app/services/data/remove-claim-document', () => mockRemoveClaimDocument)
    jest.mock('../../../../app/services/aws-helper', () => mockAwsHelper)

    const route = require('../../../../app/routes/your-claims/view-claim')
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
      mockGetViewClaim.mockResolvedValue(CLAIM)
      return supertest(app).get(ROUTE).set('Cookie', COOKIES).expect(200)
    })
  })

  describe(`POST ${ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302', () => {
      mockSubmitUpdate.mockResolvedValue()
      mockGetViewClaim.mockResolvedValue(CLAIM)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(() => {
          expect(mockViewClaimDomainObject).toHaveBeenCalledTimes(1)
        })
        .expect('location', `/your-claims/${CLAIMID}?updated=true`)
    })

    it('should respond with a 400 if validation errors', () => {
      mockGetViewClaim.mockResolvedValue(CLAIM)
      mockViewClaimDomainObject.mockImplementation(() => {
        throw new ValidationError()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(400)
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockGetViewClaim.mockResolvedValue(CLAIM)
      mockViewClaimDomainObject.mockImplementation(() => {
        throw new Error()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })

  describe(`GET ${VIEW_DOCUMENT_ROUTE}`, () => {
    it('should respond respond with 200 if valid path entered', () => {
      mockGetClaimDocumentFilePath.mockResolvedValue(VALID_FILEPATH_RESULT)
      return supertest(app).get(VIEW_DOCUMENT_ROUTE).set('Cookie', COOKIES).expect(200).expect('content-length', '4')
    })

    it('should respond with 500 if invalid path provided', () => {
      mockGetClaimDocumentFilePath.mockResolvedValue(INVALID_FILEPATH_RESULT)
      return supertest(app).get(VIEW_DOCUMENT_ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })

  describe(`POST ${REMOVE_DOCUMENT_ROUTE}`, () => {
    it('should respond with a 302 and redirect to file upload if removal of a single page document succeeds', () => {
      mockRemoveClaimDocument.mockResolvedValue()
      return supertest(app)
        .post(REMOVE_DOCUMENT_ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(() => {
          expect(mockRemoveClaimDocument).toHaveBeenCalledWith(CLAIM_DOCUMENT_ID)
        })
        .expect('location', `${ROUTE}/file-upload?document=VISIT_CONFIRMATION&eligibilityId=${ELIGIBILITY_ID}`)
    })

    it('should respond with a 302 and redirect to view claim if removal of a multi page document succeeds', () => {
      mockRemoveClaimDocument.mockResolvedValue()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&multipage=true`)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(() => {
          expect(mockRemoveClaimDocument).toHaveBeenCalledWith(CLAIM_DOCUMENT_ID)
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 302 and redirect to the file upload page if with claimExpenseId set if one was sent.', () => {
      mockRemoveClaimDocument.mockResolvedValue()
      return supertest(app)
        .post(`${REMOVE_DOCUMENT_ROUTE}&claimExpenseId=${CLAIM_EXPENSE_ID}`)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(() => {
          expect(mockRemoveClaimDocument).toHaveBeenCalledWith(CLAIM_DOCUMENT_ID)
        })
        .expect(
          'location',
          `${ROUTE}/file-upload?document=VISIT_CONFIRMATION&claimExpenseId=${CLAIM_EXPENSE_ID}&eligibilityId=${ELIGIBILITY_ID}`,
        )
    })

    it('should respond with a 500 if promise rejects', () => {
      mockRemoveClaimDocument.mockRejectedValue()
      return supertest(app).post(REMOVE_DOCUMENT_ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })
})
