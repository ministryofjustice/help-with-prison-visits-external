const supertest = require('supertest')
const routeHelper = require('../../../../../helpers/routes/route-helper')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/taxi-details', () => {
  const COOKIES = [
    'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9',
  ]
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/taxi'

  let app

  const mockUrlPathValidator = jest.fn()
  let mockExpenseUrlRouter
  const mockInsertExpense = jest.fn()
  const mockTaxiExpense = jest.fn()
  const mockGetIsAdvanceClaim = jest.fn()
  const mockGetRedirectUrl = jest.fn()
  const mockParseParams = jest.fn()

  beforeEach(() => {
    mockGetIsAdvanceClaim.mockResolvedValue({})
    mockExpenseUrlRouter = {
      getRedirectUrl: mockGetRedirectUrl,
      parseParams: mockParseParams,
    }

    jest.mock('../../../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)
    jest.mock('../../../../../../app/services/routing/expenses-url-router', () => mockExpenseUrlRouter)
    jest.mock('../../../../../../app/services/data/insert-expense', () => mockInsertExpense)
    jest.mock('../../../../../../app/services/domain/expenses/taxi-expense', () => mockTaxiExpense)
    jest.mock('../../../../../../app/services/data/get-is-advance-claim', () => mockGetIsAdvanceClaim)

    const route = require('../../../../../../app/routes/apply/eligibility/claim/taxi-details')
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
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(() => {
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })

    it('should call parseParams', () => {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockParseParams).toHaveBeenCalledTimes(1)
        })
    })
  })

  describe(`POST ${ROUTE}`, () => {
    const REDIRECT_URL = 'some-url'
    const TAXI_EXPENSE = {}

    it('should call the URL Path Validator', () => {
      mockInsertExpense.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', () => {
      mockTaxiExpense.mockReturnValue(TAXI_EXPENSE)
      mockInsertExpense.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockTaxiExpense).toHaveBeenCalledTimes(1)
          expect(mockInsertExpense).toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should redirect to date-of-birth error page if cookie is expired', () => {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should call getRedirectUrl and redirect to the url it returns', () => {
      mockGetRedirectUrl.mockReturnValue(REDIRECT_URL)
      mockInsertExpense.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockGetRedirectUrl).toHaveBeenCalledTimes(1)
        })
        .expect('location', REDIRECT_URL)
    })

    it('should respond with a 400 if domain object validation fails.', () => {
      mockTaxiExpense.mockImplementation(() => {
        throw new ValidationError()
      })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(() => {
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if any non-validation error occurs.', () => {
      mockTaxiExpense.mockImplementation(() => {
        throw new Error()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockInsertExpense.mockRejectedValue()
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })
})
