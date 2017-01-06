const routeHelper = require('../../../helpers/routes/route-helper')
const ValidationError = require('../../../../app/services/errors/validation-error')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../app/services/helpers/encrypt')
require('sinon-bluebird')

describe('/your-claims/update-contact-details', function () {
  const DOB = '2000-05-15'
  const REFERENCE = 'APVS123'
  const ENCRYPTED_REFERENCE = encrypt(REFERENCE)
  const ELIGIBILITYID = '1'
  const ROUTE = `/your-claims/${DOB}/${ENCRYPTED_REFERENCE}/update-contact-details?eligibility=${ELIGIBILITYID}`

  var app
  var urlPathValidatorStub
  var updatedContactDetailsStub
  var insertEligibilityVisitorUpdatedContactDetailStub
  var decryptStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    updatedContactDetailsStub = sinon.stub()
    insertEligibilityVisitorUpdatedContactDetailStub = sinon.stub()
    decryptStub = sinon.stub().returns(REFERENCE)

    var route = proxyquire('../../../../app/routes/your-claims/update-contact-details', {
      '../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../services/domain/updated-contact-details': updatedContactDetailsStub,
      '../../services/data/insert-eligibility-visitor-updated-contact-detail': insertEligibilityVisitorUpdatedContactDetailStub,
      '../../services/helpers/decrypt': decryptStub
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
    it('should call the URL Path Validator', function () {
      updatedContactDetailsStub.returns({})
      insertEligibilityVisitorUpdatedContactDetailStub.resolves({})
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should call the decrypt function', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(decryptStub)
        })
    })

    it('should respond with a 302 and redirect to /your-claims/:dob/:reference/check-your-information', function () {
      updatedContactDetailsStub.returns({})
      insertEligibilityVisitorUpdatedContactDetailStub.resolves({})

      return supertest(app)
        .post(ROUTE)
        .send({'email-address': 'test@test.com', 'phone-number': '5553425172'})
        .expect(302)
        .expect(function () {
          sinon.assert.calledOnce(decryptStub)
          sinon.assert.calledOnce(updatedContactDetailsStub)
          sinon.assert.calledOnce(insertEligibilityVisitorUpdatedContactDetailStub)
        })
        .expect('location', `/your-claims/${DOB}/${ENCRYPTED_REFERENCE}/check-your-information`)
    })

    it('should respond with a 400 for a validation error', function () {
      updatedContactDetailsStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 for a decryption error', function () {
      decryptStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })

    it('should respond with a 500 for a non-validation error', function () {
      updatedContactDetailsStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
