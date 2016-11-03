const supertest = require('supertest')
const sinon = require('sinon')
require('sinon-bluebird')

const routeHelper = require('../../../../../helpers/routes/route-helper')
const route = require('../../../../../../app/routes/first-time/eligibility/claim/ferry-details')
const app = routeHelper.build(route)

const UrlPathValidator = require('../../../../../../app/services/validators/url-path-validator')
const expenseUrlRouter = require('../../../../../../app/services/routing/expenses-url-router')
const insertExpense = require('../../../../../../app/services/data/insert-expense')

describe('routes/first-time/eligibility/claim/ferry', function () {
  const VALID_ROUTE = `/first-time-claim/eligibility/${routeHelper.VALID_REFERENCE}/claim/${routeHelper.VALID_CLAIM_ID}/ferry`
  const VALID_BODY = {
    'cost': '10',
    'from': 'portsmouth',
    'to': 'the isle of wight',
    'return-journey': 'yes',
    'ticket-type': 'car passenger'
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
      supertest(app)
        .get(VALID_ROUTE)
        .expect(200)
    })

    it('should call the URL Path Validator', function () {
      var urlPathValidatorSpy = sandbox.spy(UrlPathValidator, 'validate')
      supertest(app)
        .get(VALID_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })

    it('should call parseParams', function () {
      var expenseUrlRouterSpy = sandbox.spy(expenseUrlRouter, 'parseParams')
      supertest(app)
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
      supertest(app)
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
      supertest(app)
        .post(VALID_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorSpy)
        })
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      supertest(app)
        .post(VALID_ROUTE)
        .expect(400)
    })
  })
})
