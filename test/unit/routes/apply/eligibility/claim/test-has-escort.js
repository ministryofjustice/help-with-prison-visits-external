const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/has-escort', function () {
  const COOKIES = [ 'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MzYzLjAyMDUsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJyZWxhdGlvbnNoaXAiOiJyNCIsImJlbmVmaXQiOiJiMSIsInJlZmVyZW5jZUlkIjoiM2IyNDcxN2FiOWEyNDdhNzBiIiwiZGVjcnlwdGVkUmVmIjoiMVI2NEVUTiIsImNsYWltVHlwZSI6ImZpcnN0LXRpbWUiLCJhZHZhbmNlT3JQYXN0IjoicGFzdCIsImNsYWltSWQiOjh9' ]
  const COOKIES_EXPIRED = [ 'apvs-start-application=' ]
  const ROUTE = `/apply/eligibility/claim/has-escort`

  var app

  var urlPathValidatorStub
  var hasEscortStub
  var getIsAdvanceClaimStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    hasEscortStub = sinon.stub()
    getIsAdvanceClaimStub = sinon.stub().resolves()

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/claim/has-escort', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/domain/has-escort': hasEscortStub,
      '../../../../services/data/get-is-advance-claim': getIsAdvanceClaimStub
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
        .expect(function () {
          sinon.assert.calledOnce(getIsAdvanceClaimStub)
        })
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
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(hasEscortStub)
        })
        .expect(302)
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', `/apply/first-time/new-eligibility/date-of-birth?error=expired`)
    })

    it('should respond redirect to child page if hasEscort equals yes', function () {
      hasEscortStub.returns({ hasEscort: 'yes' })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', `/apply/eligibility/claim/about-escort`)
    })

    it('should respond redirect to expense page if hasEscort equals no', function () {
      hasEscortStub.returns({ hasEscort: 'no' })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', `/apply/eligibility/claim/has-child`)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      hasEscortStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(function () {
          sinon.assert.calledOnce(getIsAdvanceClaimStub)
        })
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      hasEscortStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
