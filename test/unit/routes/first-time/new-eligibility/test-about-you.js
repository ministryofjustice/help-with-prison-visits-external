const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const ValidationError = require('../../../../../app/services/errors/validation-error')

var urlPathValidatorStub
var stubInsertVisitor
var stubAboutYou
var app

describe('routes/apply/new-eligibility/about-you', function () {
  const REFERENCEID = 'ABOUTYO-1234'
  const ROUTE = `/apply/first-time/new-eligibility/1980-01-01/partner/income-support/${REFERENCEID}`

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubInsertVisitor = sinon.stub()
    stubAboutYou = sinon.stub()

    var route = proxyquire('../../../../../app/routes/apply/new-eligibility/about-you', {
      '../../../services/data/insert-visitor': stubInsertVisitor,
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
      stubAboutYou.returns({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
          sinon.assert.calledOnce(stubAboutYou)
          sinon.assert.calledOnce(stubInsertVisitor)
        })
        .expect('location', `/apply/first-time/eligibility/${REFERENCEID}/new-claim`)
    })

    it('should respond with a 400 for invalid data', function () {
      stubAboutYou.throws(new ValidationError({ 'firstName': {} }))
      return supertest(app)
        .post(ROUTE)
        .expect(400)
        .expect(function () {
          sinon.assert.calledOnce(stubAboutYou)
        })
    })
  })
})
