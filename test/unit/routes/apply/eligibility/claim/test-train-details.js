const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/train-details', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/train'

  let app

  const mockUrlPathValidator = jest.fn()
  let mockExpenseUrlRouter
  const mockInsertExpense = jest.fn()
  const mockTrainExpense = jest.fn()
  const mockGetExpenseOwnerData = jest.fn()
  const mockGetIsAdvanceClaim = jest.fn()
  const mockGetRedirectUrl = jest.fn()
  const mockParseParams = jest.fn()

  beforeEach(function () {
    mockExpenseUrlRouter.mockReturnValue({
      getRedirectUrl: mockGetRedirectUrl,
      parseParams: mockParseParams
    })

    jest.mock(
      '../../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock(
      '../../../../../../app/services/routing/expenses-url-router',
      () => mockExpenseUrlRouter
    )
    jest.mock('../../../../../../app/services/data/insert-expense', () => mockInsertExpense)
    jest.mock(
      '../../../../../../app/services/domain/expenses/train-expense',
      () => mockTrainExpense
    )
    jest.mock(
      '../../../../../../app/services/data/get-expense-owner-data',
      () => mockGetExpenseOwnerData
    )
    jest.mock(
      '../../../../../../app/services/data/get-is-advance-claim',
      () => mockGetIsAdvanceClaim
    )

    const route = require('../../../../../../app/routes/apply/eligibility/claim/train-details')
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      mockGetExpenseOwnerData.mockResolvedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should call the function to determine if claim is advance or not', function () {
      mockGetIsAdvanceClaim.mockResolvedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })

    it('should call the function to get expense owner data', function () {
      mockGetIsAdvanceClaim.mockResolvedValue()
      mockGetExpenseOwnerData.mockResolvedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockGetExpenseOwnerData).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200', function () {
      mockGetIsAdvanceClaim.mockResolvedValue()
      mockGetExpenseOwnerData.mockResolvedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })

    it('should call parseParams', function () {
      mockGetIsAdvanceClaim.mockResolvedValue()
      mockGetExpenseOwnerData.mockResolvedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockParseParams).toHaveBeenCalledTimes(1)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const REDIRECT_URL = 'some-url'
    const TRAIN_EXPENSE = {}

    it('should call the URL Path Validator', function () {
      mockInsertExpense.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      mockTrainExpense.mockReturnValue(TRAIN_EXPENSE)
      mockInsertExpense.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockTrainExpense).toHaveBeenCalledTimes(1)
          expect(mockInsertExpense).toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should call getRedirectUrl and redirect to the url it returns', function () {
      mockGetRedirectUrl.mockReturnValue(REDIRECT_URL)
      mockInsertExpense.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockGetRedirectUrl).toHaveBeenCalledTimes(1)
        })
        .expect('location', REDIRECT_URL)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      mockGetExpenseOwnerData.mockResolvedValue()
      mockTrainExpense.mockImplementation(() => { throw new ValidationError() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      mockTrainExpense.mockImplementation(() => { throw new Error() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockInsertExpense.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
