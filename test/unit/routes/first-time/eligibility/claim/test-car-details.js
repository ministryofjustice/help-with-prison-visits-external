const supertest = require('supertest')
const sinon = require('sinon')
require('sinon-bluebird')

const routeHelper = require('../../../../../helpers/routes/route-helper')
const route = require('../../../../../../app/routes/first-time/eligibility/claim/car-details')
const app = routeHelper.build(route)

const UrlPathValidator = require('../../../../../../app/services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../../../app/services/routing/expenses-url-router')
const getTravellingFromAndTo = require('../../../../../../app/services/data/get-travelling-from-and-to')
const insertCarExpense = require('../../../../../../app/services/data/insert-car-expenses')

describe('routes/first-time/eligibility/claim/car', function () {
  const VALID_ROUTE = `/first-time-claim/eligibility/${routeHelper.VALID_REFERENCE}/claim/${routeHelper.VALID_CLAIM_ID}/car`
  const VALID_BODY = {
    'from': 'Belfast',
    'to': 'Belfast City',
    'toll': 'yes',
    'toll-cost': '20',
    'parking': 'yes',
    'parking-cost': '20'
  }
  const INVALID_BODY = {
    'toll': 'yes',
    'toll-cost': '',
    'parking': 'yes',
    'parking-cost': ''
  }

  var sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe(`GET ${VALID_ROUTE}`, function () {
    it('should respond with a 200', function () {
      sandbox.stub(getTravellingFromAndTo, 'get').resolves()
      return supertest(app)
        .get(VALID_ROUTE)
        .expect(200)
    })

    it('should call the URL Path Validator', function () {
      sandbox.stub(getTravellingFromAndTo, 'get').resolves()
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return supertest(app)
        .get(VALID_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })

    it('should call parseParams', function () {
      sandbox.stub(getTravellingFromAndTo, 'get').resolves()
      var expenseUrlRouterSpy = sandbox.spy(expenseUrlRouter, 'parseParams')
      return supertest(app)
        .get(VALID_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(expenseUrlRouterSpy)
        })
    })

    it('should call parseParams', function () {
      var getTravellingFromAndToSpy = sandbox.stub(getTravellingFromAndTo, 'get').resolves()
      return supertest(app)
        .get(VALID_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(getTravellingFromAndToSpy)
        })
    })
  })

  describe(`POST ${VALID_ROUTE}`, function () {
    it('should respond with a 200 if expected body parameters are set', function () {
      var expenseUrlRouterSpy = sandbox.spy(expenseUrlRouter, 'getRedirectUrl')
      var stubInsertCarExpense = sandbox.stub(insertCarExpense, 'insert').resolves()
      return supertest(app)
        .post(VALID_ROUTE)
        .send(VALID_BODY)
        .expect(function () {
          sinon.assert.calledOnce(expenseUrlRouterSpy)
          sinon.assert.calledOnce(stubInsertCarExpense)
        })
        .expect(302)
    })

    it('should call the URL Path Validator', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      sandbox.stub(insertCarExpense, 'insert').resolves()
      return supertest(app)
        .post(VALID_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      return supertest(app)
        .post(VALID_ROUTE)
        .send(INVALID_BODY)
        .expect(400)
    })
  })
})
