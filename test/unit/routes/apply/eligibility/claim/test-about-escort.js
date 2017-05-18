const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/about-escort', function () {
  const ROUTE = `/apply/eligibility/claim/about-escort`
  const COOKIES = [ 'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MzY2LjQ2MDk4MzMzMiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiIzYjI0NzE3YWI5YTI0N2E3MGIiLCJkZWNyeXB0ZWRSZWYiOiIxUjY0RVROIiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6OH0=' ]
  const COOKIES_EXPIRED = [ 'apvs-start-application=' ]

  var app

  var urlPathValidatorStub
  var aboutEscortStub
  var insertEscortStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    aboutEscortStub = sinon.stub()
    insertEscortStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/claim/about-escort', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/domain/about-escort': aboutEscortStub,
      '../../../../services/data/insert-escort': insertEscortStub
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
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 if domain object is built successfully', function () {
      insertEscortStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(aboutEscortStub)
        })
        .expect(302)
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', `/start-already-registered?error=expired`)
    })

    it('should respond redirect to the has-child page domain object was built successfully', function () {
      insertEscortStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', `/apply/eligibility/claim/has-child`)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      aboutEscortStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      aboutEscortStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      insertEscortStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
