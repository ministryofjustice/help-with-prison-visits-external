const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const ValidationError = require('../../../../../app/services/errors/validation-error')

var urlPathValidatorStub
var stubDateOfBirth
var app

describe('routes/apply/new-eligibility/date-of-birth', function () {
  const ROUTE = '/apply/first-time/new-eligibility'

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubDateOfBirth = sinon.stub()

    var route = proxyquire(
      '../../../../../app/routes/apply/new-eligibility/date-of-birth', {
        '../../../services/domain/date-of-birth': stubDateOfBirth,
        '../../../services/validators/url-path-validator': urlPathValidatorStub
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
    describe('for over-sixteen date', function () {
      it('should call the URL Path Validator', function () {
        return supertest(app)
          .get(ROUTE)
          .expect(function () {
            sinon.assert.calledOnce(urlPathValidatorStub)
          })
      })

      it('should respond with a 302 and redirect to /apply/first-time/new-eligibility/:dob', function () {
        var dob = '113725122'
        stubDateOfBirth.returns({encodedDate: dob, sixteenOrUnder: false})
        return supertest(app)
          .post(ROUTE)
          .expect(302)
          .expect(function () {
            sinon.assert.calledOnce(stubDateOfBirth)
          })
          .expect('location', `/apply/first-time/new-eligibility/${dob}`)
      })

      it('should respond with a 400 for a validation error', function () {
        stubDateOfBirth.throws(new ValidationError())
        return supertest(app)
          .post(ROUTE)
          .expect(400)
      })

      it('should respond with a 500 for a non-validation error', function () {
        stubDateOfBirth.throws(new Error())
        return supertest(app)
          .post(ROUTE)
          .expect(500)
      })
    })
  })
})
