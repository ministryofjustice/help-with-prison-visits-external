const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const ValidationError = require('../../../../../app/services/errors/validation-error')

let urlPathValidatorStub
let stubEligibleChild
let stubInsertEligibleChild
let app

describe('routes/apply/new-eligibility/eligible-child', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI2MzM1MjEwLjU5NDQ2NjY2OCwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InIxNCIsImJlbmVmaXQiOiJiMSIsImJlbmVmaXRPd25lciI6InllcyIsInJlZmVyZW5jZUlkIjoiNDI0MzcwMWVhYWM3NGRhNzBiYTg4ZmIyIiwiZGVjcnlwdGVkUmVmIjoiSDU3UFYxRCJ9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/eligible-child'

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubEligibleChild = sinon.stub()
    stubInsertEligibleChild = sinon.stub()

    const route = proxyquire('../../../../../app/routes/apply/new-eligibility/eligible-child', {
      '../../../services/data/insert-eligible-child': stubInsertEligibleChild,
      '../../../services/domain/eligible-child': stubEligibleChild,
      '../../../services/validators/url-path-validator': urlPathValidatorStub
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
  })

  describe(`POST ${ROUTE}`, function () {
    it('should persist data and redirect to first-time/about-you for valid data', function () {
      const newEligibleChild = {}
      stubEligibleChild.returns(newEligibleChild)
      stubInsertEligibleChild.resolves({ reference: 'NEWREF1', eligibilityId: 1234 })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
          sinon.assert.calledOnce(stubEligibleChild)
          sinon.assert.calledOnce(stubInsertEligibleChild)
        })
        .expect('location', '/apply/first-time/new-eligibility/about-you')
    })

    it('should persist data and redirect to /apply/first-time/new-eligibility/date-of-birth?error=expired', function () {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newEligibleChild = {}
      stubEligibleChild.returns(newEligibleChild)
      stubInsertEligibleChild.resolves({ reference: newReference, eligibilityId: newEligibilityId })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should respond with a 400 for invalid data', function () {
      stubEligibleChild.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      stubEligibleChild.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      stubInsertEligibleChild.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
