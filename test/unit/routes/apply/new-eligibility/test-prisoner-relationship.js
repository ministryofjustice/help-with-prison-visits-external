const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../app/services/errors/validation-error')
const prisonerRelationshipEnum = require('../../../../../app/constants/prisoner-relationships-enum')

describe('routes/apply/new-eligibility/prisoner-relationship', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTAwMjc0Ljc0NjYzMzMzMiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImRvYkVuY29kZWQiOiIxMTM3MjUxMjIifQ==']
  const COOKIES_REPEAT = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MTM3LjcxOTk2NjY2NSwiZGVjcnlwdGVkUmVmIjoiVEtZQ0NSQSIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QlEifQ==']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/prisoner-relationship'

  var app

  var urlPathValidatorStub
  var prisonerRelationshipStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    prisonerRelationshipStub = sinon.stub()

    var route = proxyquire('../../../../../app/routes/apply/new-eligibility/prisoner-relationship', {
      '../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../services/domain/prisoner-relationship': prisonerRelationshipStub
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

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const VALID_RELATIONSHIP = prisonerRelationshipEnum.PARTNER.urlValue
    const INVALID_RELATIONSHIP = 'r14'
    const VALID_PRISONER_RELATIONSHIP = {
      relationship: VALID_RELATIONSHIP
    }
    const INVALID_PRISONER_RELATIONSHIP = {
      relationship: INVALID_RELATIONSHIP
    }

    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 and redirect to benefits page if the relationship value is valid', function () {
      prisonerRelationshipStub.returns(VALID_PRISONER_RELATIONSHIP)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/benefits')
    })

    it('should respond with a 302 and redirect to /apply/first-time/new-eligibility?error=expired', function () {
      prisonerRelationshipStub.returns(VALID_PRISONER_RELATIONSHIP)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should respond with a 302 and redirect to benefits page with reference/prisoner-number query params if repeat-new-eligibility', function () {
      const REPEAT_NEW_ELIGIBILITY_ROUTE = '/apply/repeat-new-eligibility/new-eligibility/prisoner-relationship'

      prisonerRelationshipStub.returns(VALID_PRISONER_RELATIONSHIP)

      return supertest(app)
        .post(REPEAT_NEW_ELIGIBILITY_ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(302)
        .expect('location', '/apply/repeat-new-eligibility/new-eligibility/benefits')
    })

    it('should respond with a 302 and redirect to /eligibility-fail if the relationship is set to none', function () {
      prisonerRelationshipStub.returns(INVALID_PRISONER_RELATIONSHIP)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', '/eligibility-fail')
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      prisonerRelationshipStub.returns(VALID_PRISONER_RELATIONSHIP)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(prisonerRelationshipStub)
        })
        .expect(302)
    })

    it('should respond with a 400 if domain object validation fails', function () {
      prisonerRelationshipStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if a non-validation error is thrown', function () {
      prisonerRelationshipStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
