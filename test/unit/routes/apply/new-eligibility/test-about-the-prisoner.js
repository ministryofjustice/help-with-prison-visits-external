const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const ValidationError = require('../../../../../app/services/errors/validation-error')

var urlPathValidatorStub
var stubAboutThePrisoner
var stubInsertNewEligibilityAndPrisoner
var app

describe('routes/apply/new-eligibility/about-the-prisoner', function () {
  const COOKIES = [ 'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTAxMDQxLjkxNjQ1LCJjbGFpbVR5cGUiOiJmaXJzdC10aW1lIiwiZG9iRW5jb2RlZCI6IjExMzcyNTEyMiIsInJlbGF0aW9uc2hpcCI6InIyIiwiYmVuZWZpdCI6ImIxIn0=' ]
  const COOKIES_EXPIRED = [ 'apvs-start-application=' ]
  const ROUTE = '/apply/first-time/new-eligibility/about-the-prisoner'

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubAboutThePrisoner = sinon.stub()
    stubInsertNewEligibilityAndPrisoner = sinon.stub()

    var route = proxyquire('../../../../../app/routes/apply/new-eligibility/about-the-prisoner', {
      '../../../services/data/insert-new-eligibility-and-prisoner': stubInsertNewEligibilityAndPrisoner,
      '../../../services/domain/about-the-prisoner': stubAboutThePrisoner,
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
      var newReference = 'NEWREF1'
      var newEligibilityId = 1234
      var newAboutThePrisoner = {}
      stubInsertNewEligibilityAndPrisoner.resolves({reference: newReference, eligibilityId: newEligibilityId})
      stubAboutThePrisoner.returns(newAboutThePrisoner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
          sinon.assert.calledOnce(stubAboutThePrisoner)
          sinon.assert.calledWith(stubInsertNewEligibilityAndPrisoner, newAboutThePrisoner, 'first-time', undefined)
        })
        .expect('location', `/apply/first-time/new-eligibility/about-you`)
    })

    it('should persist data and redirect to /apply/first-time/new-eligibility?error=expired', function () {
      var newReference = 'NEWREF1'
      var newEligibilityId = 1234
      var newAboutThePrisoner = {}
      stubInsertNewEligibilityAndPrisoner.resolves({reference: newReference, eligibilityId: newEligibilityId})
      stubAboutThePrisoner.returns(newAboutThePrisoner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', `/apply/first-time/new-eligibility/date-of-birth?error=expired`)
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
