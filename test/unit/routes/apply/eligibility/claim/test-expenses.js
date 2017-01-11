const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/expenses', function () {
  const REFERENCE = 'V123456'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const CLAIMID = '1'
  const ROUTE = `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIMID}`

  var app

  var urlPathValidatorStub
  var expenseUrlRouterStub
  var expensesStub
  var getClaimSummaryStub
  var prisonsHelperStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    expenseUrlRouterStub = sinon.stub()
    expensesStub = sinon.stub()
    getClaimSummaryStub = sinon.stub().resolves({ claim: { NameOfPrison: 'hewell' } })
    prisonsHelperStub = { isNorthernIrelandPrison: sinon.stub() }

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/claim/expenses', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/routing/expenses-url-router': expenseUrlRouterStub,
      '../../../../services/domain/expenses/expenses': expensesStub,
      '../../../../services/data/get-claim-summary': getClaimSummaryStub,
      '../../../../constants/helpers/prisons-helper': prisonsHelperStub
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

    it('should call to get claim details and check if NI prison', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(getClaimSummaryStub)
          sinon.assert.calledOnce(prisonsHelperStub.isNorthernIrelandPrison)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const REDIRECT_URL = 'some-url'
    const EXPENSES = {}

    it('should call the URL Path Validator', function () {
      expensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 if domain object is built successfully', function () {
      expensesStub.returns(EXPENSES)
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(expensesStub)
        })
        .expect(302)
    })

    it('should call getRedirectUrl and redirect to the url it returns', function () {
      var getRedirectUrl = sinon.stub(expenseUrlRouterStub, 'getRedirectUrl').returns(REDIRECT_URL)
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(getRedirectUrl)
        })
        .expect('location', REDIRECT_URL)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      expensesStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
        .expect(function () {
          sinon.assert.calledOnce(getClaimSummaryStub)
          sinon.assert.calledOnce(prisonsHelperStub.isNorthernIrelandPrison)
        })
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      expensesStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
