const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../../app/services/helpers/encrypt')
require('sinon-bluebird')
const ValidationError = require('../../../../../app/services/errors/validation-error')

var urlPathValidatorStub
var stubAboutThePrisoner
var stubInsertNewEligibilityAndPrisoner
var app

describe('routes/apply/new-eligibility/about-the-prisoner', function () {
  const ROUTE = '/apply/first-time/new-eligibility/1980-01-01/partner/income-support'

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubAboutThePrisoner = sinon.stub()
    stubInsertNewEligibilityAndPrisoner = sinon.stub()

    var route = proxyquire('../../../../../app/routes/apply/new-eligibility/about-the-prisoner', {
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
      var newReference = 'NEWREF1'
      var newEligibilityId = 1234
      var newAboutThePrisoner = {}
      stubInsertNewEligibilityAndPrisoner.resolves({reference: newReference, eligibilityId: newEligibilityId})
      stubAboutThePrisoner.returns(newAboutThePrisoner)

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
          sinon.assert.calledOnce(stubAboutThePrisoner)
          sinon.assert.calledWith(stubInsertNewEligibilityAndPrisoner, newAboutThePrisoner, 'first-time', undefined)
        })
        .expect('location', `${ROUTE}/${encrypt(`${newReference}-${newEligibilityId}`)}`)
    })

    it('should respond with a 400 for invalid data', function () {
      stubAboutThePrisoner.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      stubAboutThePrisoner.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
