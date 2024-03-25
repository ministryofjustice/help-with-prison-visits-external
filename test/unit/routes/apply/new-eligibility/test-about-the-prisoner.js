const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')
const ValidationError = require('../../../../../app/services/errors/validation-error')

let urlPathValidatorStub
let stubAboutThePrisoner
let stubInsertNewEligibilityAndPrisoner
let app

jest.mock(
  '../../../services/data/insert-new-eligibility-and-prisoner',
  () => stubInsertNewEligibilityAndPrisoner
);

jest.mock('../../../services/domain/about-the-prisoner', () => stubAboutThePrisoner);

jest.mock(
  '../../../services/validators/url-path-validator',
  () => urlPathValidatorStub
);

describe('routes/apply/new-eligibility/about-the-prisoner', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI1OTQ4MDg2LjY0NDMsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJyZWxhdGlvbnNoaXAiOiJyNCIsImJlbmVmaXQiOiJiMSIsImJlbmVmaXRPd25lciI6InllcyJ9']
  const COOKIES_NOT_BENEFIT_OWNER = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI1OTQ4MDk3LjE1MTI4MzMzNSwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InIxIiwiYmVuZWZpdCI6ImIxIiwiYmVuZWZpdE93bmVyIjoibm8ifQ==']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/about-the-prisoner'

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubAboutThePrisoner = sinon.stub()
    stubInsertNewEligibilityAndPrisoner = sinon.stub()

    const route = require('../../../../../app/routes/apply/new-eligibility/about-the-prisoner')

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
    it('should persist data and redirect to first-time/about-you for valid data and benefit owner', function () {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newAboutThePrisoner = {}
      stubInsertNewEligibilityAndPrisoner.resolves({ reference: newReference, eligibilityId: newEligibilityId })
      stubAboutThePrisoner.returns(newAboutThePrisoner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
          sinon.assert.calledWith(stubInsertNewEligibilityAndPrisoner, newAboutThePrisoner, 'first-time', undefined)
        })
        .expect('location', '/apply/first-time/new-eligibility/about-you');
    })

    it('should persist data and redirect to first-time/benefit-owner for valid data and not benefit owner', function () {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newAboutThePrisoner = {}
      stubInsertNewEligibilityAndPrisoner.resolves({ reference: newReference, eligibilityId: newEligibilityId })
      stubAboutThePrisoner.returns(newAboutThePrisoner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_NOT_BENEFIT_OWNER)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
          sinon.assert.calledWith(stubInsertNewEligibilityAndPrisoner, newAboutThePrisoner, 'first-time', undefined)
        })
        .expect('location', '/apply/first-time/new-eligibility/benefit-owner');
    })

    it('should persist data and redirect to /apply/first-time/new-eligibility?error=expired', function () {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newAboutThePrisoner = {}
      stubInsertNewEligibilityAndPrisoner.resolves({ reference: newReference, eligibilityId: newEligibilityId })
      stubAboutThePrisoner.returns(newAboutThePrisoner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should respond with a 400 for invalid data', function () {
      stubAboutThePrisoner.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      stubAboutThePrisoner.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      stubInsertNewEligibilityAndPrisoner.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
