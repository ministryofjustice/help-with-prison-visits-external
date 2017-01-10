const routeHelper = require('../../../helpers/routes/route-helper')
const ValidationError = require('../../../../app/services/errors/validation-error')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../app/services/helpers/encrypt')
require('sinon-bluebird')

describe('/your-claims/check-your-information', function () {
  const DOB = '2000-05-15'
  const REFERENCE = 'APVS123'
  const ENCRYPTED_REFERENCE = encrypt(REFERENCE)
  const ROUTE = `/your-claims/${DOB}/${ENCRYPTED_REFERENCE}/check-your-information`

  var app

  var urlPathValidatorStub
  var decryptStub
  var getRepeatEligibility
  var CheckYourInformation

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    decryptStub = sinon.stub().returns(REFERENCE)
    getRepeatEligibility = sinon.stub()
    CheckYourInformation = sinon.stub()

    var route = proxyquire('../../../../app/routes/your-claims/check-your-information', {
      '../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../services/helpers/decrypt': decryptStub,
      '../../services/data/get-repeat-eligibility': getRepeatEligibility,
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

    it('should call the decrypt function', function () {
      decryptStub.returns(REFERENCE)
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(decryptStub)
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
      getRepeatEligibility.resolves({NameOfPrison: 'hewell'})
      var eligibilityId = '1234'
      var referenceId = `${REFERENCE}-${eligibilityId}`
      var encryptedReferenceId = encrypt(referenceId)

      return supertest(app)
        .post(ROUTE)
        .send({EligibilityId: eligibilityId})
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(CheckYourInformation)
        })
        .expect('location', `/apply/repeat/eligibility/${encryptedReferenceId}/new-claim`)
    })

    it('should redirect to /apply/repeat/eligibility/:referenceId/new-claim/same-journey-as-last-claim/past for Northern Ireland prison', function () {
      CheckYourInformation.returns({})
      getRepeatEligibility.resolves({NameOfPrison: 'maghaberry'})
      var eligibilityId = '1234'
      var referenceId = `${REFERENCE}-${eligibilityId}`
      var encryptedReferenceId = encrypt(referenceId)

      return supertest(app)
        .post(ROUTE)
        .send({EligibilityId: eligibilityId})
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(CheckYourInformation)
        })
        .expect('location', `/apply/repeat/eligibility/${encryptedReferenceId}/new-claim/same-journey-as-last-claim/past`)
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
