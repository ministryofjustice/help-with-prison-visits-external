const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/has-escort', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MzYzLjAyMDUsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJyZWxhdGlvbnNoaXAiOiJyNCIsImJlbmVmaXQiOiJiMSIsInJlZmVyZW5jZUlkIjoiM2IyNDcxN2FiOWEyNDdhNzBiIiwiZGVjcnlwdGVkUmVmIjoiMVI2NEVUTiIsImNsYWltVHlwZSI6ImZpcnN0LXRpbWUiLCJhZHZhbmNlT3JQYXN0IjoicGFzdCIsImNsYWltSWQiOjh9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/has-escort'

  let app

  const mockUrlPathValidator = jest.fn()
  const mockHasEscort = jest.fn()
  const mockGetIsAdvanceClaim = jest.fn()

  beforeEach(function () {
    mockGetIsAdvanceClaim.mockResolvedValue()

    jest.mock(
      '../../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock('../../../../../../app/services/domain/has-escort', () => mockHasEscort)
    jest.mock(
      '../../../../../../app/services/data/get-is-advance-claim',
      () => mockGetIsAdvanceClaim
    )

    const route = require('../../../../../../app/routes/apply/eligibility/claim/has-escort')
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
        .expect(function () {
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 if domain object is built successfully', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockHasEscort).toHaveBeenCalledTimes(1)
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

    it('should respond redirect to child page if hasEscort equals yes', function () {
      mockHasEscort.mockReturnValue({ hasEscort: 'yes' })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', '/apply/eligibility/claim/about-escort')
    })

    it('should respond redirect to expense page if hasEscort equals no', function () {
      mockHasEscort.mockReturnValue({ hasEscort: 'no' })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', '/apply/eligibility/claim/has-child')
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      mockHasEscort.mockImplementation(() => { throw new ValidationError() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(function () {
          expect(mockGetIsAdvanceClaim).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      mockHasEscort.mockImplementation(() => { throw new Error() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
