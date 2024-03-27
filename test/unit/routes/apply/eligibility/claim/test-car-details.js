const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/car-details', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9']
  const COOKIES_REPEAT = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDI1LjQ2OTMxNjY2NSwiZGVjcnlwdGVkUmVmIjoiUUhRQ1hXWiIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QkMiLCJyZWZlcmVuY2VJZCI6IjViM2UxNjBkYTRhMTUzYTcwZiIsImNsYWltVHlwZSI6InJlcGVhdCIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTJ9']
  const COOKIES_EXPIRED = ['apvs-start-application=']

  const ROUTE = '/apply/eligibility/claim/car'
  const ROUTE_REPEAT = '/apply/eligibility/claim/car'
  const ROUTE_CAR_ONLY = '/apply/eligibility/claim/car-only'

  let app

  const mockUrlPathValidator = jest.fn()
  const mockExpenseUrlRouter = jest.fn()
  const mockInsertCarExpenses = jest.fn()
  const mockGetTravellingFromAndTo = jest.fn()
  const mockCarExpense = jest.fn()
  const mockGetMaskedEligibility = jest.fn()
  const mockGetIsAdvanceClaim = jest.fn()

  beforeEach(function () {
    mockGetIsAdvanceClaim.mockResolvedValue()

    jest.mock(
      '../../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock(
      '../../../../../../app/services/routing/expenses-url-router',
      () => mockExpenseUrlRouter
    )
    jest.mock(
      '../../../../../../app/services/data/insert-car-expenses',
      () => mockInsertCarExpenses
    )
    jest.mock(
      '../../../../../../app/services/data/get-travelling-from-and-to',
      () => mockGetTravellingFromAndTo
    )
    jest.mock('../../../../../../app/services/domain/expenses/car-expense', () => mockCarExpense)
    jest.mock(
      '../../../../../../app/services/data/get-masked-eligibility',
      () => mockGetMaskedEligibility
    )
    jest.mock(
      '../../../../../../app/services/data/get-is-advance-claim',
      () => mockGetIsAdvanceClaim
    )

    const route = require('../../../../../../app/routes/apply/eligibility/claim/car-details')
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      mockGetTravellingFromAndTo.mockResolvedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200', function () {
      mockGetTravellingFromAndTo.mockResolvedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })

    it('should call parseParams', function () {
      mockGetTravellingFromAndTo.mockResolvedValue()
      const parseParams = sinon.stub(mockExpenseUrlRouter, 'parseParams')
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(parseParams).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockGetTravellingFromAndTo.mockRejectedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`REPEAT - GET ${ROUTE_REPEAT}`, function () {
    it('should call the URL Path Validator', function () {
      mockGetMaskedEligibility.mockResolvedValue()
      return supertest(app)
        .get(ROUTE_REPEAT)
        .set('Cookie', COOKIES_REPEAT)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('REPEAT - should respond with a 200', function () {
      mockGetMaskedEligibility.mockResolvedValue({ from: '', to: '' })
      return supertest(app)
        .get(ROUTE_REPEAT)
        .set('Cookie', COOKIES_REPEAT)
        .expect(200)
        .expect(function () {
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('REPEAT - should call parseParams', function () {
      mockGetMaskedEligibility.mockResolvedValue({ from: '', to: '' })
      const parseParams = sinon.stub(mockExpenseUrlRouter, 'parseParams')
      return supertest(app)
        .get(ROUTE_REPEAT)
        .set('Cookie', COOKIES_REPEAT)
        .expect(function () {
          expect(parseParams).toHaveBeenCalledTimes(1)
        })
    })

    it('REPEAT - should respond with a 500 if promise rejects.', function () {
      mockGetMaskedEligibility.mockRejectedValue()
      return supertest(app)
        .get(ROUTE_REPEAT)
        .set('Cookie', COOKIES_REPEAT)
        .expect(500)
    })
  })

  describe(`GET ${ROUTE_CAR_ONLY}`, function () {
    it('should respond with a 200', function () {
      mockGetTravellingFromAndTo.mockResolvedValue()
      return supertest(app)
        .get(ROUTE_CAR_ONLY)
        .set('Cookie', COOKIES)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const REDIRECT_URL = 'some-url'
    const CAR_EXPENSE = {}

    it('should call the URL Path Validator', function () {
      mockInsertCarExpenses.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      mockCarExpense.mockReturnValue(CAR_EXPENSE)
      mockInsertCarExpenses.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockCarExpense).toHaveBeenCalledTimes(1)
          expect(mockInsertCarExpenses).toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should call getRedirectUrl and redirect to the url it returns', function () {
      const getRedirectUrl = sinon.stub(mockExpenseUrlRouter, 'getRedirectUrl').mockReturnValue(REDIRECT_URL)
      mockInsertCarExpenses.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(getRedirectUrl).toHaveBeenCalledTimes(1)
        })
        .expect('location', REDIRECT_URL)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      mockCarExpense.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(function () {
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      mockCarExpense.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockInsertCarExpenses.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE_CAR_ONLY}`, function () {
    const CAR_EXPENSE = {}

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      mockCarExpense.mockReturnValue(CAR_EXPENSE)
      mockInsertCarExpenses.mockResolvedValue()
      return supertest(app)
        .post(ROUTE_CAR_ONLY)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockCarExpense).toHaveBeenCalledTimes(1)
          expect(mockInsertCarExpenses).toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })
  })
})
