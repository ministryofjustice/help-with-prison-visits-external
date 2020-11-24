const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/about-child', function () {
  const CLAIMID = '123'

  const ROUTE = '/apply/eligibility/claim/about-child'
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MzcyLjM2NDU2NjY2NSwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiIzYjI0NzE3YWI5YTI0N2E3MGIiLCJkZWNyeXB0ZWRSZWYiOiIxUjY0RVROIiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6OH0=']
  const COOKIES_EXPIRED = ['apvs-start-application=']

  let app

  let urlPathValidatorStub
  let aboutChildStub
  let insertChildStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    aboutChildStub = sinon.stub()
    insertChildStub = sinon.stub()

    const route = proxyquire('../../../../../../app/routes/apply/eligibility/claim/about-child', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/domain/about-child': aboutChildStub,
      '../../../../services/data/insert-child': insertChildStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
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
      insertChildStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should insert valid NewClaim domain object', function () {
      aboutChildStub.returns(ABOUT_CHILD)
      insertChildStub.resolves(CLAIMID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(aboutChildStub)
          sinon.assert.calledOnce(insertChildStub)
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
      insertChildStub.resolves(CLAIMID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', '/apply/eligibility/claim/expenses')
    })

    it('should redirect to the about-child page if add-another-child is set to yes', function () {
      insertChildStub.resolves(CLAIMID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send({
          'add-another-child': 'yes'
        })
        .expect('location', ROUTE)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      insertChildStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      insertChildStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      insertChildStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
