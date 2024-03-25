const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')
const ValidationError = require('../../../../../app/services/errors/validation-error')

let urlPathValidatorStub
let stubBenefitOwner
let stubInsertBenefitOwner
let app

jest.mock(
  '../../../services/data/insert-benefit-owner',
  () => stubInsertBenefitOwner
);

jest.mock('../../../services/domain/benefit-owner', () => stubBenefitOwner);

jest.mock(
  '../../../services/validators/url-path-validator',
  () => urlPathValidatorStub
);

describe('routes/apply/new-eligibility/benefit-owner', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI1OTQ4MTE0Ljg5MDAxNjY2OCwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InIxIiwiYmVuZWZpdCI6ImIxIiwiYmVuZWZpdE93bmVyIjoibm8iLCJyZWZlcmVuY2VJZCI6IjMzM2UxMzBjY2JiYjQ4YTcwYWFiOGFiNCIsImRlY3J5cHRlZFJlZiI6IjlIVEI3TUEifQ==']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/benefit-owner'

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubBenefitOwner = sinon.stub()
    stubInsertBenefitOwner = sinon.stub()

    const route = require('../../../../../app/routes/apply/new-eligibility/benefit-owner')

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
  })

  describe(`POST ${ROUTE}`, function () {
    it('should persist data and redirect to first-time/about-you for valid data', function () {
      const newBenefitOwner = {}
      stubInsertBenefitOwner.resolves({ reference: 'NEWREF1', eligibilityId: 1234 })
      stubBenefitOwner.returns(newBenefitOwner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/first-time/new-eligibility/about-you');
    })

    it('should persist data and redirect to /apply/first-time/benefit-owner?error=expired', function () {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newBenefitOwner = {}
      stubBenefitOwner.returns(newBenefitOwner)
      stubInsertBenefitOwner.resolves({ reference: newReference, eligibilityId: newEligibilityId })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should respond with a 400 for invalid data', function () {
      stubBenefitOwner.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      stubBenefitOwner.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      stubInsertBenefitOwner.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
