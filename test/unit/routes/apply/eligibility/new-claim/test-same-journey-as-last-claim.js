const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/new-claim/same-journey-as-last-claim', function () {
  const COOKIES_REPEAT = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MTY2LjEwMTQ4MzMzNCwiZGVjcnlwdGVkUmVmIjoiUUhRQ1hXWiIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QkMiLCJyZWZlcmVuY2VJZCI6IjViM2UxNjBkYTRhMTUzYTcwZiIsImNsYWltVHlwZSI6InJlcGVhdCIsImFkdmFuY2VPclBhc3QiOiJwYXN0In0=']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/new-claim/same-journey-as-last-claim'
  const REFERENCE = 'SAMEJO'

  let app

  let urlPathValidatorStub
  let sameJourneyAsLastClaimStub
  let getLastClaimDetailsStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    sameJourneyAsLastClaimStub = sinon.stub()
    getLastClaimDetailsStub = sinon.stub()

    const route = proxyquire('../../../../../../app/routes/apply/eligibility/new-claim/same-journey-as-last-claim', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/domain/same-journey-as-last-claim': sameJourneyAsLastClaimStub,
      '../../../../services/data/get-last-claim-details': getLastClaimDetailsStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200', function () {
      getLastClaimDetailsStub.resolves({ expenses: [REFERENCE] })
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(200)
    })

    it('should respond with a 302 when no expenses and cannot duplicate claim', function () {
      getLastClaimDetailsStub.resolves({ expenses: [] })
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(302)
    })

    it('should respond with a 500 if promise rejects.', function () {
      getLastClaimDetailsStub.rejects()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should redirect to /new-claim/past for a repeat claim if no', function () {
      sameJourneyAsLastClaimStub.returns({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .send({ 'same-journey-as-last-claim': 'no' })
        .expect('location', '/apply/eligibility/new-claim/journey-information')
    })

    it('should redirect to /new-claim/past for a repeat-duplicate claim if yes', function () {
      sameJourneyAsLastClaimStub.returns({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .send({ 'same-journey-as-last-claim': 'yes' })
        .expect('location', '/apply/eligibility/new-claim/journey-information')
    })

    it('should redirect to start-already-registerederror error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      sameJourneyAsLastClaimStub.throws(new ValidationError())
      getLastClaimDetailsStub.resolves({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects.', function () {
      sameJourneyAsLastClaimStub.throws(new ValidationError())
      getLastClaimDetailsStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(500)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      sameJourneyAsLastClaimStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(500)
    })
  })
})
