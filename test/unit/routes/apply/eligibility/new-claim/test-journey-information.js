const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/new-claim/journey-information', function () {
  const CLAIM_ID = '123'
  const ROUTE = '/apply/eligibility/new-claim/journey-information'

  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MjI4LjQxMjQzMzMzNCwiZG9iRW5jb2RlZCI6IjExMzcyNTEyMiIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1MjJmMWQxZWJhYzY1ZGE3MGIiLCJkZWNyeXB0ZWRSZWYiOiJYWVpQRjBUIiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0In0=']
  const COOKIES_REPEAT_DUPLICATE = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MjQwLjY4ODE2NjY2NywiZGVjcnlwdGVkUmVmIjoiVEtZQ0NSQSIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QlEiLCJyZWZlcmVuY2VJZCI6IjVlM2QxZTBkYmZhNDQ4YTcwYyIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1UeXBlIjoicmVwZWF0LWR1cGxpY2F0ZSJ9']
  const COOKIES_EXPIRED = ['apvs-start-application=']

  let app

  const mockUrlPathValidator = jest.fn()
  const mockNewClaim = jest.fn()
  const mockInsertNewClaim = jest.fn()
  const mockInsertRepeatDuplicateClaim = jest.fn()
  const mockGetReleaseDate = jest.fn()

  const releaseDate = [
    {
      ReleaseDateIsSet: false,
      ReleaseDate: null
    }
  ]

  beforeEach(function () {
    jest.mock(
      '../../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock('../../../../../../app/services/domain/new-claim', () => mockNewClaim)
    jest.mock('../../../../../../app/services/data/insert-new-claim', () => mockInsertNewClaim)
    jest.mock(
      '../../../../../../app/services/data/insert-repeat-duplicate-claim',
      () => mockInsertRepeatDuplicateClaim
    )
    jest.mock('../../../../../../app/services/data/get-release-date', () => mockGetReleaseDate)

    const route = require(
      '../../../../../../app/routes/apply/eligibility/new-claim/journey-information'
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
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const FIRST_TIME_CLAIM = {}
    const REPEAT_DUPLICATE_CLAIM = {}

    it('should call the URL Path Validator', function () {
      mockGetReleaseDate.mockResolvedValue(releaseDate)
      mockInsertNewClaim.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should insert valid NewClaim domain object', function () {
      mockGetReleaseDate.mockResolvedValue(releaseDate)
      mockNewClaim.mockReturnValue(FIRST_TIME_CLAIM)
      mockInsertNewClaim.mockResolvedValue(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockNewClaim).toHaveBeenCalledTimes(1)
          expect(mockInsertNewClaim).toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should redirect to has-escort page if child-visitor is set to no', function () {
      mockGetReleaseDate.mockResolvedValue(releaseDate)
      mockInsertNewClaim.mockResolvedValue(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', '/apply/eligibility/claim/has-escort')
    })

    it('should redirect to claim summary page if claim is repeat duplicate', function () {
      mockGetReleaseDate.mockResolvedValue(releaseDate)
      mockNewClaim.mockReturnValue(REPEAT_DUPLICATE_CLAIM)
      mockInsertRepeatDuplicateClaim.mockResolvedValue(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT_DUPLICATE)
        .expect('location', '/apply/eligibility/claim/summary')
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      mockGetReleaseDate.mockResolvedValue(releaseDate)
      mockInsertNewClaim.mockResolvedValue(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockInsertRepeatDuplicateClaim.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      mockGetReleaseDate.mockResolvedValue(releaseDate)
      mockInsertNewClaim.mockImplementation(() => { throw new ValidationError() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      mockInsertNewClaim.mockImplementation(() => { throw new Error() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockInsertNewClaim.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
