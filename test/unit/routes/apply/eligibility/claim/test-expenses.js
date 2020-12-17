const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/expenses', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MzgxLjEzODEzMzMzMiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiIzYjI0NzE3YWI5YTI0N2E3MGIiLCJkZWNyeXB0ZWRSZWYiOiIxUjY0RVROIiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6OH0=']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/expenses'

  let app

  let urlPathValidatorStub
  let expenseUrlRouterStub
  let expensesStub
  let getClaimSummaryStub
  let getIsAdvanceClaimStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    expenseUrlRouterStub = sinon.stub()
    expensesStub = sinon.stub()
    getClaimSummaryStub = sinon.stub().resolves({ claim: { Country: 'England' } })
    getIsAdvanceClaimStub = sinon.stub().resolves()

    const route = proxyquire('../../../../../../app/routes/apply/eligibility/claim/expenses', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/routing/expenses-url-router': expenseUrlRouterStub,
      '../../../../services/domain/expenses/expenses': expensesStub,
      '../../../../services/data/get-claim-summary': getClaimSummaryStub,
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

    it('should call to get claim details and check if NI prison', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(getClaimSummaryStub)
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
    const REDIRECT_URL = 'some-url'
    const EXPENSES = {}

    it('should call the URL Path Validator', function () {
      expensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 if domain object is built successfully', function () {
      expensesStub.returns(EXPENSES)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(expensesStub)
        })
        .expect(302)
    })

    it('should call getRedirectUrl and redirect to the url it returns', function () {
      const getRedirectUrl = sinon.stub(expenseUrlRouterStub, 'getRedirectUrl').returns(REDIRECT_URL)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(getRedirectUrl)
        })
        .expect('location', REDIRECT_URL)
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      expensesStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(function () {
          sinon.assert.calledOnce(getClaimSummaryStub)
          sinon.assert.calledOnce(getIsAdvanceClaimStub)
        })
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      expensesStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
