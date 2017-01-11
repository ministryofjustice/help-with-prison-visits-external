const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../../../app/services/helpers/encrypt')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/car-details', function () {
  const REFERENCE = 'V123456'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const ENCRYPTED_REFERENCEID = encrypt(REFERENCEID)
  const CLAIMID = '1'
  const ROUTE = `/apply/first-time/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIMID}/car`
  const ROUTE_REPEAT = `/apply/repeat/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIMID}/car`
  const ROUTE_CAR_ONLY = `/apply/first-time/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIMID}/car-only`

  var app

  var urlPathValidatorStub
  var expenseUrlRouterStub
  var insertCarExpensesStub
  var getTravellingFromAndToStub
  var carExpenseStub
  var getMaskedEligibilityStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    expenseUrlRouterStub = sinon.stub()
    insertCarExpensesStub = sinon.stub()
    getTravellingFromAndToStub = sinon.stub()
    carExpenseStub = sinon.stub()
    getMaskedEligibilityStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/claim/car-details', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/routing/expenses-url-router': expenseUrlRouterStub,
      '../../../../services/data/insert-car-expenses': insertCarExpensesStub,
      '../../../../services/data/get-travelling-from-and-to': getTravellingFromAndToStub,
      '../../../../services/domain/expenses/car-expense': carExpenseStub,
      '../../../../services/data/get-masked-eligibility': getMaskedEligibilityStub
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
      getTravellingFromAndToStub.resolves()
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })

    it('should call parseParams', function () {
      getTravellingFromAndToStub.resolves()
      var parseParams = sinon.stub(expenseUrlRouterStub, 'parseParams')
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(parseParams)
        })
    })
  })

  describe(`GET ${ROUTE_REPEAT}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE_REPEAT)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200', function () {
      getMaskedEligibilityStub.resolves({from: '', to: ''})
      return supertest(app)
        .get(ROUTE_REPEAT)
        .expect(200)
    })

    it('should call parseParams', function () {
      getMaskedEligibilityStub.resolves({from: '', to: ''})
      var parseParams = sinon.stub(expenseUrlRouterStub, 'parseParams')
      return supertest(app)
        .get(ROUTE_REPEAT)
        .expect(function () {
          sinon.assert.calledOnce(parseParams)
        })
    })
  })

  describe(`GET ${ROUTE_CAR_ONLY}`, function () {
    it('should respond with a 200', function () {
      getTravellingFromAndToStub.resolves()
      return supertest(app)
        .get(ROUTE_CAR_ONLY)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const REDIRECT_URL = 'some-url'
    const CAR_EXPENSE = {}

    it('should call the URL Path Validator', function () {
      insertCarExpensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      carExpenseStub.returns(CAR_EXPENSE)
      insertCarExpensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(carExpenseStub)
          sinon.assert.calledOnce(insertCarExpensesStub)
          sinon.assert.calledWith(insertCarExpensesStub, REFERENCE, ELIGIBILITYID, CLAIMID, CAR_EXPENSE)
        })
        .expect(302)
    })

    it('should call getRedirectUrl and redirect to the url it returns', function () {
      var getRedirectUrl = sinon.stub(expenseUrlRouterStub, 'getRedirectUrl').returns(REDIRECT_URL)
      insertCarExpensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(getRedirectUrl)
        })
        .expect('location', REDIRECT_URL)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      carExpenseStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      carExpenseStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE_CAR_ONLY}`, function () {
    const CAR_EXPENSE = {}

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      carExpenseStub.returns(CAR_EXPENSE)
      insertCarExpensesStub.resolves()
      return supertest(app)
        .post(ROUTE_CAR_ONLY)
        .expect(function () {
          sinon.assert.calledOnce(carExpenseStub)
          sinon.assert.calledOnce(insertCarExpensesStub)
          sinon.assert.calledWith(insertCarExpensesStub, REFERENCE, ELIGIBILITYID, CLAIMID, CAR_EXPENSE)
        })
        .expect(302)
    })
  })
})
