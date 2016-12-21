const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/has-child', function () {
  const REFERENCE = 'V123456'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const CLAIMID = '1'
  const ROUTE = `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/has-child`

  var app

  var urlPathValidatorStub
  var hasChildStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    hasChildStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/claim/has-child', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/domain/has-child': hasChildStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 if domain object is built successfully', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(hasChildStub)
        })
        .expect(302)
    })

    it('should respond redirect to child page if hasChild equals yes', function () {
      hasChildStub.returns({ hasChild: 'yes' })
      return supertest(app)
        .post(ROUTE)
        .expect('location', `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/child`)
    })

    it('should respond redirect to expense page if hasChild equals no', function () {
      hasChildStub.returns({ hasChild: 'no' })
      return supertest(app)
        .post(ROUTE)
        .expect('location', `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}`)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      hasChildStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      hasChildStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
