const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../app/services/errors/validation-error')
const prisonerRelationshipEnum = require('../../../../../app/constants/prisoner-relationships-enum')
const benefitsEnum = require('../../../../../app/constants/benefits-enum')

describe('routes/apply/new-eligibility/benefits', function () {
  const DOB = '1988-05-15'
  const RELATIONSHIP = prisonerRelationshipEnum.CHILD.urlValue
  const ROUTE = `/apply/first-time/new-eligibility/${DOB}/${RELATIONSHIP}`

  var app

  var urlPathValidatorStub
  var benefitsStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    benefitsStub = sinon.stub()

    var route = proxyquire('../../../../../app/routes/apply/new-eligibility/benefits', {
      '../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../services/domain/benefits': benefitsStub
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
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const VALID_BENEFIT = benefitsEnum.INCOME_SUPPORT.urlValue
    const INVALID_BENEFIT = 'none'
    const VALID_PRISONER_BENEFIT = {
      benefit: VALID_BENEFIT
    }
    const INVALID_PRISONER_BENEFIT = {
      benefit: INVALID_BENEFIT
    }

    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 and redirect to prisoner page if the relationship value is valid', function () {
      benefitsStub.returns(VALID_PRISONER_BENEFIT)
      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect('location', `${ROUTE}/${VALID_BENEFIT}`)
    })

    it('should respond with a 302 and redirect to prisoner page with reference/prisoner-number query params if repeat-new-eligibility', function () {
      const REFERENCE = 'REP1234'
      const PRISONER_NUMBER = '12345678'
      const REPEAT_NEW_ELIGIBILITY_ROUTE = `/apply/repeat-new-eligibility/new-eligibility/${DOB}/${RELATIONSHIP}?reference=${REFERENCE}&prisoner-number=${PRISONER_NUMBER}`

      benefitsStub.returns(VALID_PRISONER_BENEFIT)

      return supertest(app)
        .post(REPEAT_NEW_ELIGIBILITY_ROUTE)
        .expect(302)
        .expect('location', `/apply/repeat-new-eligibility/new-eligibility/${DOB}/${RELATIONSHIP}/${VALID_BENEFIT}?reference=${REFERENCE}&prisoner-number=${PRISONER_NUMBER}`)
    })

    it('should respond with a 302 and redirect to /eligibility-fail if the benefit is set to none', function () {
      benefitsStub.returns(INVALID_PRISONER_BENEFIT)
      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .expect('location', '/eligibility-fail')
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      benefitsStub.returns(VALID_PRISONER_BENEFIT)
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(benefitsStub)
        })
        .expect(302)
    })

    it('should respond with a 400 if domain object validation fails', function () {
      benefitsStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if a non-validation error is thrown', function () {
      benefitsStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
