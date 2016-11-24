const routeHelper = require('../../../helpers/routes/route-helper')
const ValidationError = require('../../../../app/services/errors/validation-error')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

describe('/your-claims/check-your-information', function () {
  const DOB = '2000-05-15'
  const REFERENCE = 'APVS123'
  const ROUTE = `/your-claims/${DOB}/${REFERENCE}/check-your-information`

  var app

  var urlPathValidatorStub
  var getRepeatEligibility
  var CheckYourInformation

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    getRepeatEligibility = sinon.stub()
    CheckYourInformation = sinon.stub()

    var route = proxyquire('../../../../app/routes/your-claims/check-your-information', {
      '../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../services/get-repeat-eligibility': getRepeatEligibility,
      '../../services/domain/check-your-information': CheckYourInformation
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

    it('should call to get masked eligibility and respond with a 200', function () {
      getRepeatEligibility.resolves({})
      return supertest(app)
        .get(ROUTE)
        .expect(200)
        .expect(function () {
          sinon.assert.calledOnce(getRepeatEligibility)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 302 and redirect to /apply/repeat/eligibility/:referenceId/new-claim', function () {
      CheckYourInformation.returns({})
      var eligibilityId = '1234'
      var referenceId = `${REFERENCE}-${eligibilityId}`

      return supertest(app)
        .post(ROUTE)
        .send({EligibilityId: eligibilityId})
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(CheckYourInformation)
        })
        .expect('location', `/apply/repeat/eligibility/${referenceId}/new-claim`)
    })

    it('should respond with a 400 for a validation error', function () {
      CheckYourInformation.throws(new ValidationError())
      getRepeatEligibility.resolves({})
      return supertest(app)
        .post(ROUTE)
        .expect(400)
        .expect(function () {
          sinon.assert.calledOnce(getRepeatEligibility)
        })
    })

    it('should respond with a 500 for a non-validation error', function () {
      CheckYourInformation.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
