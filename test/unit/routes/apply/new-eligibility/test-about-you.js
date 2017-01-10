const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const ValidationError = require('../../../../../app/services/errors/validation-error')

var urlPathValidatorStub
var stubInsertVisitor
var stubGetTravellingFromAndTo
var stubAboutYou
var app

describe('routes/apply/new-eligibility/about-you', function () {
  const REFERENCEID = 'ABOUTYO-1234'
  const ROUTE = `/apply/first-time/new-eligibility/1980-01-01/partner/income-support/${REFERENCEID}`

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubInsertVisitor = sinon.stub()
    stubGetTravellingFromAndTo = sinon.stub()
    stubAboutYou = sinon.stub()

    var route = proxyquire('../../../../../app/routes/apply/new-eligibility/about-you', {
      '../../../services/data/insert-visitor': stubInsertVisitor,
      '../../../services/data/get-travelling-from-and-to': stubGetTravellingFromAndTo,
      '../../../services/domain/about-you': stubAboutYou,
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
    it('should persist data and redirect to /apply/first-time/eligibility/:reference/new-claim for valid data', function () {
      stubInsertVisitor.resolves()
      stubGetTravellingFromAndTo.resolves({to: 'hewell'})
      stubAboutYou.returns({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
          sinon.assert.calledOnce(stubAboutYou)
          sinon.assert.calledOnce(stubInsertVisitor)
          sinon.assert.calledOnce(stubGetTravellingFromAndTo)
        })
        .expect('location', `/apply/first-time/eligibility/${REFERENCEID}/new-claim`)
    })

    it('should redirect to /apply/first-time/eligibility/:reference/new-claim/past for Northern Ireland Prison', function () {
      stubInsertVisitor.resolves()
      stubGetTravellingFromAndTo.resolves({to: 'maghaberry'})
      stubAboutYou.returns({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect('location', `/apply/first-time/eligibility/${REFERENCEID}/new-claim/past`)
    })

    it('should respond with a 400 for invalid data', function () {
      stubAboutYou.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      stubAboutYou.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
