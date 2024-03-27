const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/expenses', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MzgxLjEzODEzMzMzMiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiIzYjI0NzE3YWI5YTI0N2E3MGIiLCJkZWNyeXB0ZWRSZWYiOiIxUjY0RVROIiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6OH0=']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/expenses'

  let app

  const mockUrlPathValidator = jest.fn()
  const mockExpenseUrlRouter = jest.fn()
  const mockExpenses = jest.fn()
  const mockGetClaimSummary = jest.fn()
  const mockGetIsAdvanceClaim = jest.fn()

  beforeEach(function () {
    mockGetClaimSummary.mockResolvedValue({ claim: { Country: 'England' } })
    mockGetIsAdvanceClaim.mockResolvedValue()

    jest.mock(
      '../../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock(
      '../../../../../../app/services/routing/expenses-url-router',
      () => mockExpenseUrlRouter
    )
    jest.mock('../../../../../../app/services/domain/expenses/expenses', () => mockExpenses)
    jest.mock('../../../../../../app/services/data/get-claim-summary', () => mockGetClaimSummary)
    jest.mock(
      '../../../../../../app/services/data/get-is-advance-claim',
      () => mockGetIsAdvanceClaim
    )

    const route = require('../../../../../../app/routes/apply/eligibility/claim/expenses')
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

    it('should call to get claim details and check if NI prison', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockGetClaimSummary).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const REDIRECT_URL = 'some-url'
    const EXPENSES = {}

    it('should call the URL Path Validator', function () {
      mockExpenses.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 if domain object is built successfully', function () {
      mockExpenses.mockReturnValue(EXPENSES)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockExpenses).toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should call getRedirectUrl and redirect to the url it returns', function () {
      const getRedirectUrl = sinon.stub(mockExpenseUrlRouter, 'getRedirectUrl').mockReturnValue(REDIRECT_URL)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(getRedirectUrl).toHaveBeenCalledTimes(1)
        })
        .expect('location', REDIRECT_URL)
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      mockExpenses.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(function () {
          expect(mockGetClaimSummary).toHaveBeenCalledTimes(1)
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      mockExpenses.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
