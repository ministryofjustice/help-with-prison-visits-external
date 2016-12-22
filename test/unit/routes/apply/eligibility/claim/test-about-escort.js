const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/about-escort', function () {
  const REFERENCE = 'V123456'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const CLAIMID = '1'
  const ROUTE = `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/escort`

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
      insertEscortStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(aboutEscortStub)
        })
        .expect(302)
    })

    it('should respond redirect to the has-child page domain object was built successfully', function () {
      insertEscortStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect('location', `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}/has-child`)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      aboutEscortStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      aboutEscortStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
