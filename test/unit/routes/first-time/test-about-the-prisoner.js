const routeHelper = require('../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const ValidationError = require('../../../../app/services/errors/validation-error')

var urlPathValidatorStub
var stubAboutThePrisoner
var stubInsertNewEligibilityAndPrisoner
var app

describe('routes/first-time/new-eligibility/about-the-prisoner', function () {
  const ROUTE = '/first-time/new-eligibility/1980-01-01/partner/income-support'

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubAboutThePrisoner = sinon.stub()
    stubInsertNewEligibilityAndPrisoner = sinon.stub()

    var route = proxyquire('../../../../app/routes/first-time/new-eligibility/about-the-prisoner', {
      '../../../services/data/insert-new-eligibility-and-prisoner': stubInsertNewEligibilityAndPrisoner,
      '../../../services/domain/about-the-prisoner': stubAboutThePrisoner,
      '../../../services/validators/url-path-validator': urlPathValidatorStub
    })

    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200 for valid path parameters', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should persist data and redirect to first-time/about-you for valid data', function () {
      var newReference = '1234567'
      stubInsertNewEligibilityAndPrisoner.resolves(newReference)
      stubAboutThePrisoner.returns({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
          sinon.assert.calledOnce(stubAboutThePrisoner)
          sinon.assert.calledOnce(stubInsertNewEligibilityAndPrisoner)
        })
        .expect('location', `${ROUTE}/${newReference}`)
    })

    it('should respond with a 400 for invalid data', function () {
      stubAboutThePrisoner.throws(new ValidationError({ 'NameOfPrison': {} }))

      return supertest(app)
        .post(ROUTE)
        .expect(400)
        .expect(function () {
          sinon.assert.calledOnce(stubAboutThePrisoner)
        })
    })
  })
})
