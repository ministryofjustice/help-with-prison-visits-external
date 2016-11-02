const supertest = require('supertest')
const sinon = require('sinon')
require('sinon-bluebird')

const routeHelper = require('../../../../../helpers/routes/route-helper')
const route = require('../../../../../../app/routes/first-time/eligibility/claim/plane-details')
const app = routeHelper.build(route)

const UrlPathValidator = require('../../../../../../app/services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../../../app/services/routing/expenses-url-router')
const insertExpense = require('../../../../../../app/services/data/insert-expense')

describe('routes/first-time/eligibility/claim/plane', function () {
  const VALID_ROUTE = `/first-time-claim/eligibility/${routeHelper.VALID_REFERENCE}/claim/${routeHelper.VALID_CLAIM_ID}/plane`
  const VALID_BODY = {
    'cost': '100',
    'from': 'Heathrow',
    'to': 'Belfast City',
    'return-journey': 'yes'
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
      return supertest(app)
        .get(VALID_ROUTE)
        .expect(200)
    })

    it('should call the URL Path Validator', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return supertest(app)
        .get(VALID_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })

    it('should call parseParams', function () {
      var expenseUrlRouterSpy = sandbox.spy(expenseUrlRouter, 'parseParams')
      return supertest(app)
        .get(VALID_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(expenseUrlRouterSpy)
        })
    })
  })

  describe(`POST ${VALID_ROUTE}`, function () {
    it('should respond with a 200 if expected body parameters are set', function () {
      var expenseUrlRouterSpy = sandbox.spy(expenseUrlRouter, 'getRedirectUrl')
      var stubInsertExpense = sandbox.stub(insertExpense, 'insert').resolves()
      return supertest(app)
        .post(VALID_ROUTE)
        .send(VALID_BODY)
        .expect(function () {
          sinon.assert.calledOnce(expenseUrlRouterSpy)
          sinon.assert.calledOnce(stubInsertExpense)
        })
        .expect(302)
    })

    it('should call the URL Path Validator', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      return supertest(app)
        .post(VALID_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      return supertest(app)
        .post(VALID_ROUTE)
        .expect(400)
    })
  })
})
