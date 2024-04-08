const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const ValidationError = require('../../../../../app/services/errors/validation-error')

const mockUrlPathValidator = jest.fn()
const mockInsertVisitor = jest.fn()
const mockDuplicateClaimCheck = jest.fn()
const mockGetTravellingFromAndTo = jest.fn()
const mockAboutYou = jest.fn()
let app

describe('routes/apply/new-eligibility/about-you', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI1OTQ4MDkwLjYyODkxNjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwiYmVuZWZpdE93bmVyIjoieWVzIiwicmVmZXJlbmNlSWQiOiI0ZTMzMDkxZmJkY2YzZmE3MGFhYjhhYjUiLCJkZWNyeXB0ZWRSZWYiOiJERU5RQTk2IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSJ9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/about-you'

  beforeEach(function () {
    jest.mock('../../../../../app/services/data/insert-visitor', () => mockInsertVisitor)
    jest.mock(
      '../../../../../app/services/data/duplicate-claim-check',
      () => mockDuplicateClaimCheck
    )
    jest.mock(
      '../../../../../app/services/data/get-travelling-from-and-to',
      () => mockGetTravellingFromAndTo
    )
    jest.mock('../../../../../app/services/domain/about-you', () => mockAboutYou)
    jest.mock(
      '../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )

    const route = require('../../../../../app/routes/apply/new-eligibility/about-you')

    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200 for valid path parameters', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should persist data and redirect to /apply/eligibility/new-claim/future-or-past-visit for valid data', function () {
      mockDuplicateClaimCheck.mockResolvedValue(false)
      mockInsertVisitor.mockResolvedValue()
      mockGetTravellingFromAndTo.mockResolvedValue({ to: 'hewell' })
      mockAboutYou.mockReturnValue({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
          expect(mockAboutYou).toHaveBeenCalledTimes(1)
          expect(mockInsertVisitor).toHaveBeenCalledTimes(1)
          expect(mockGetTravellingFromAndTo).toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/eligibility/new-claim/future-or-past-visit')
    })

    it('should persist data and redirect to /apply/first-time/new-eligibility/date-of-birth?error=expired', function () {
      mockDuplicateClaimCheck.mockResolvedValue(false)
      mockInsertVisitor.mockResolvedValue()
      mockGetTravellingFromAndTo.mockResolvedValue({ to: 'hewell' })
      mockAboutYou.mockReturnValue({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .set('Cookie', COOKIES_EXPIRED)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should not do duplicate check for Northern Ireland person', function () {
      mockAboutYou.mockReturnValue({
        country: 'Northern Ireland',
        postCode: 'BT12 2WW'
      })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
          expect(mockAboutYou).toHaveBeenCalledTimes(1)
          expect(mockDuplicateClaimCheck).not.toHaveBeenCalled()
          expect(mockInsertVisitor).not.toHaveBeenCalled()
          expect(mockGetTravellingFromAndTo).not.toHaveBeenCalled()
        })
    })

    it('should respond with a 400 for invalid data', function () {
      mockAboutYou.mockImplementation(() => { throw new ValidationError() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 400 for a duplicate claim', function () {
      mockDuplicateClaimCheck.mockResolvedValue(true)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      mockAboutYou.mockImplementation(() => { throw new Error() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockInsertVisitor.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
