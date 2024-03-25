const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

jest.mock(
  '../../../../services/validators/url-path-validator',
  () => urlPathValidatorStub
);

jest.mock(
  '../../../../services/routing/expenses-url-router',
  () => expenseUrlRouterStub
);

jest.mock('../../../../services/data/insert-expense', () => insertExpenseStub);

jest.mock(
  '../../../../services/domain/expenses/accommodation-expense',
  () => accommodationExpense
);

jest.mock(
  '../../../../services/data/get-is-advance-claim',
  () => getIsAdvanceClaimStub
);

describe('routes/apply/eligibility/claim/accommodation-details', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/accommodation'

  let app

  let urlPathValidatorStub
  let expenseUrlRouterStub
  let insertExpenseStub
  let accommodationExpense
  let getIsAdvanceClaimStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    expenseUrlRouterStub = sinon.stub()
    insertExpenseStub = sinon.stub()
    accommodationExpense = sinon.stub()
    getIsAdvanceClaimStub = sinon.stub().resolves()

    const route = require(
      '../../../../../../app/routes/apply/eligibility/claim/accommodation-details'
    )
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should call parseParams', function () {
      const parseParams = sinon.stub(expenseUrlRouterStub, 'parseParams')
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const REDIRECT_URL = 'some-url'
    const ACCOMMODATION_EXPENSE = {}

    it('should call the URL Path Validator', function () {
      insertExpenseStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      accommodationExpense.returns(ACCOMMODATION_EXPENSE)
      insertExpenseStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect(302);
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should call getRedirectUrl and redirect to the url it returns', function () {
      const getRedirectUrl = sinon.stub(expenseUrlRouterStub, 'getRedirectUrl').returns(REDIRECT_URL)
      insertExpenseStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', REDIRECT_URL);
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      accommodationExpense.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      accommodationExpense.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      insertExpenseStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
