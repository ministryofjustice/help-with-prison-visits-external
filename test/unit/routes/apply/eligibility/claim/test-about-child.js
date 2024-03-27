const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/about-child', function () {
  const CLAIMID = '123'

  const ROUTE = '/apply/eligibility/claim/about-child'
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MzcyLjM2NDU2NjY2NSwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiIzYjI0NzE3YWI5YTI0N2E3MGIiLCJkZWNyeXB0ZWRSZWYiOiIxUjY0RVROIiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6OH0=']
  const COOKIES_EXPIRED = ['apvs-start-application=']

  let app

  const mockUrlPathValidator = jest.fn()
  const mockAboutChild = jest.fn()
  const mockInsertChild = jest.fn()

  beforeEach(function () {
    jest.mock(
      '../../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock('../../../../../../app/services/domain/about-child', () => mockAboutChild)
    jest.mock('../../../../../../app/services/data/insert-child', () => mockInsertChild)

    const route = require('../../../../../../app/routes/apply/eligibility/claim/about-child')
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
    const ABOUT_CHILD = {}

    it('should call the URL Path Validator', function () {
      mockInsertChild.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should insert valid NewClaim domain object', function () {
      mockAboutChild.mockReturnValue(ABOUT_CHILD)
      mockInsertChild.mockResolvedValue(CLAIMID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockAboutChild).toHaveBeenCalledTimes(1)
          expect(mockInsertChild).toHaveBeenCalledTimes(1)
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

    it('should redirect to expenses page if add-another-child is set to no', function () {
      mockInsertChild.mockResolvedValue(CLAIMID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', '/apply/eligibility/claim/expenses')
    })

    it('should redirect to the about-child page if add-another-child is set to yes', function () {
      mockInsertChild.mockResolvedValue(CLAIMID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send({
          'add-another-child': 'yes'
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      mockInsertChild.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      mockInsertChild.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockInsertChild.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
