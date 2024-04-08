const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/new-claim/same-journey-as-last-claim', function () {
  const COOKIES_REPEAT = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MTY2LjEwMTQ4MzMzNCwiZGVjcnlwdGVkUmVmIjoiUUhRQ1hXWiIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QkMiLCJyZWZlcmVuY2VJZCI6IjViM2UxNjBkYTRhMTUzYTcwZiIsImNsYWltVHlwZSI6InJlcGVhdCIsImFkdmFuY2VPclBhc3QiOiJwYXN0In0=']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/new-claim/same-journey-as-last-claim'
  const REFERENCE = 'SAMEJO'

  let app

  const mockUrlPathValidator = jest.fn()
  const mockSameJourneyAsLastClaim = jest.fn()
  const mockGetLastClaimDetails = jest.fn()

  beforeEach(function () {
    jest.mock(
      '../../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock(
      '../../../../../../app/services/domain/same-journey-as-last-claim',
      () => mockSameJourneyAsLastClaim
    )
    jest.mock(
      '../../../../../../app/services/data/get-last-claim-details',
      () => mockGetLastClaimDetails
    )

    const route = require(
      '../../../../../../app/routes/apply/eligibility/new-claim/same-journey-as-last-claim'
    )
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200', function () {
      mockGetLastClaimDetails.mockResolvedValue({ expenses: [REFERENCE] })
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(200)
    })

    it('should respond with a 302 when no expenses and cannot duplicate claim', function () {
      mockGetLastClaimDetails.mockResolvedValue({ expenses: [] })
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(302)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockGetLastClaimDetails.mockRejectedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should redirect to /new-claim/past for a repeat claim if no', function () {
      mockSameJourneyAsLastClaim.mockReturnValue({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .send({ 'same-journey-as-last-claim': 'no' })
        .expect('location', '/apply/eligibility/new-claim/journey-information')
    })

    it('should redirect to /new-claim/past for a repeat-duplicate claim if yes', function () {
      mockSameJourneyAsLastClaim.mockReturnValue({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .send({ 'same-journey-as-last-claim': 'yes' })
        .expect('location', '/apply/eligibility/new-claim/journey-information')
    })

    it('should redirect to start-already-registerederror error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      mockSameJourneyAsLastClaim.mockImplementation(() => { throw new ValidationError() })
      mockGetLastClaimDetails.mockResolvedValue({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockSameJourneyAsLastClaim.mockImplementation(() => { throw new ValidationError() })
      mockGetLastClaimDetails.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(500)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      mockSameJourneyAsLastClaim.mockImplementation(() => { throw new Error() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(500)
    })
  })
})
