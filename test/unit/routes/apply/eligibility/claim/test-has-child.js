const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

jest.mock(
  '../../../../services/validators/url-path-validator',
  () => urlPathValidatorStub
);

jest.mock('../../../../services/domain/has-child', () => hasChildStub);

describe('routes/apply/eligibility/claim/has-child', function () {
  const ROUTE = '/apply/eligibility/claim/has-child'

  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MzcwLjMxMjcxNjY2NywiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiIzYjI0NzE3YWI5YTI0N2E3MGIiLCJkZWNyeXB0ZWRSZWYiOiIxUjY0RVROIiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6OH0=']
  const COOKIES_EXPIRED = ['apvs-start-application=']

  let app

  let urlPathValidatorStub
  let hasChildStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    hasChildStub = sinon.stub()

    const route = require('../../../../../../app/routes/apply/eligibility/claim/has-child')
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 302 if domain object is built successfully', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect(302);
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond redirect to child page if hasChild equals yes', function () {
      hasChildStub.returns({ hasChild: 'yes' })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', '/apply/eligibility/claim/about-child')
    })

    it('should respond redirect to expense page if hasChild equals no', function () {
      hasChildStub.returns({ hasChild: 'no' })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', '/apply/eligibility/claim/expenses')
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      hasChildStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      hasChildStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
