const supertest = require('supertest')
const routeHelper = require('../../../../../helpers/routes/route-helper')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/about-escort', () => {
  const ROUTE = '/apply/eligibility/claim/about-escort'
  const COOKIES = [
    'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MzY2LjQ2MDk4MzMzMiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiIzYjI0NzE3YWI5YTI0N2E3MGIiLCJkZWNyeXB0ZWRSZWYiOiIxUjY0RVROIiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6OH0=',
  ]
  const COOKIES_EXPIRED = ['apvs-start-application=']

  let app

  const mockUrlPathValidator = jest.fn()
  const mockAboutEscort = jest.fn()
  const mockInsertEscort = jest.fn()

  beforeEach(() => {
    jest.mock('../../../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)
    jest.mock('../../../../../../app/services/domain/about-escort', () => mockAboutEscort)
    jest.mock('../../../../../../app/services/data/insert-escort', () => mockInsertEscort)

    const route = require('../../../../../../app/routes/apply/eligibility/claim/about-escort')
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

    it('should respond with a 302 if domain object is built successfully', () => {
      mockInsertEscort.mockResolvedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockInsertEscort).toHaveBeenCalledTimes(1)
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

    it('should respond redirect to the has-child page domain object was built successfully', () => {
      mockInsertEscort.mockResolvedValue()
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect('location', '/apply/eligibility/claim/has-child')
    })

    it('should respond with a 400 if domain object validation fails.', () => {
      mockAboutEscort.mockImplementation(() => {
        throw new ValidationError()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', () => {
      mockAboutEscort.mockImplementation(() => {
        throw new Error()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockInsertEscort.mockRejectedValue()
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })
})
