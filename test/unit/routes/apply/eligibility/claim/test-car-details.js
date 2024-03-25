const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

jest.mock(
  '../../../../services/validators/url-path-validator',
  () => urlPathValidatorStub
)

jest.mock(
  '../../../../services/routing/expenses-url-router',
  () => expenseUrlRouterStub
)

jest.mock(
  '../../../../services/data/insert-car-expenses',
  () => insertCarExpensesStub
)

jest.mock(
  '../../../../services/data/get-travelling-from-and-to',
  () => getTravellingFromAndToStub
)

jest.mock('../../../../services/domain/expenses/car-expense', () => carExpenseStub)

jest.mock(
  '../../../../services/data/get-masked-eligibility',
  () => getMaskedEligibilityStub
)

jest.mock(
  '../../../../services/data/get-is-advance-claim',
  () => getIsAdvanceClaimStub
)

describe('routes/apply/eligibility/claim/car-details', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9']
  const COOKIES_REPEAT = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDI1LjQ2OTMxNjY2NSwiZGVjcnlwdGVkUmVmIjoiUUhRQ1hXWiIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QkMiLCJyZWZlcmVuY2VJZCI6IjViM2UxNjBkYTRhMTUzYTcwZiIsImNsYWltVHlwZSI6InJlcGVhdCIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTJ9']
  const COOKIES_EXPIRED = ['apvs-start-application=']

  const ROUTE = '/apply/eligibility/claim/car'
  const ROUTE_REPEAT = '/apply/eligibility/claim/car'
  const ROUTE_CAR_ONLY = '/apply/eligibility/claim/car-only'

  let app

  let urlPathValidatorStub
  let expenseUrlRouterStub
  let insertCarExpensesStub
  let getTravellingFromAndToStub
  let carExpenseStub
  let getMaskedEligibilityStub
  let getIsAdvanceClaimStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    expenseUrlRouterStub = sinon.stub()
    insertCarExpensesStub = sinon.stub()
    getTravellingFromAndToStub = sinon.stub()
    carExpenseStub = sinon.stub()
    getMaskedEligibilityStub = sinon.stub()
    getIsAdvanceClaimStub = sinon.stub().resolves()

    const route = require('../../../../../../app/routes/apply/eligibility/claim/car-details')
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      getTravellingFromAndToStub.resolves()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200', function () {
      getTravellingFromAndToStub.resolves()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should call parseParams', function () {
      getTravellingFromAndToStub.resolves()
      const parseParams = sinon.stub(expenseUrlRouterStub, 'parseParams')
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if promise rejects.', function () {
      getTravellingFromAndToStub.rejects()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`REPEAT - GET ${ROUTE_REPEAT}`, function () {
    it('should call the URL Path Validator', function () {
      getMaskedEligibilityStub.resolves()
      return supertest(app)
        .get(ROUTE_REPEAT)
        .set('Cookie', COOKIES_REPEAT)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('REPEAT - should respond with a 200', function () {
      getMaskedEligibilityStub.resolves({ from: '', to: '' })
      return supertest(app)
        .get(ROUTE_REPEAT)
        .set('Cookie', COOKIES_REPEAT)
        .expect(200)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('REPEAT - should call parseParams', function () {
      getMaskedEligibilityStub.resolves({ from: '', to: '' })
      const parseParams = sinon.stub(expenseUrlRouterStub, 'parseParams')
      return supertest(app)
        .get(ROUTE_REPEAT)
        .set('Cookie', COOKIES_REPEAT)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('REPEAT - should respond with a 500 if promise rejects.', function () {
      getMaskedEligibilityStub.rejects()
      return supertest(app)
        .get(ROUTE_REPEAT)
        .set('Cookie', COOKIES_REPEAT)
        .expect(500)
    })
  })

  describe(`GET ${ROUTE_CAR_ONLY}`, function () {
    it('should respond with a 200', function () {
      getTravellingFromAndToStub.resolves()
      return supertest(app)
        .get(ROUTE_CAR_ONLY)
        .set('Cookie', COOKIES)
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
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      carExpenseStub.returns(CAR_EXPENSE)
      insertCarExpensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should call getRedirectUrl and redirect to the url it returns', function () {
      const getRedirectUrl = sinon.stub(expenseUrlRouterStub, 'getRedirectUrl').returns(REDIRECT_URL)
      insertCarExpensesStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', REDIRECT_URL)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      carExpenseStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      carExpenseStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      insertCarExpensesStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
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
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })
  })
})
