const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const ValidationError = require('../../../../../app/services/errors/validation-error')

let urlPathValidatorStub
let stubDateOfBirth
let app

describe('routes/apply/new-eligibility/date-of-birth', function () {
  const DOB = '113725122'
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTAwMjE5LjI3OTk4MzMzNCwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSJ9']
  const ROUTE = '/apply/first-time/new-eligibility/date-of-birth'

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubDateOfBirth = sinon.stub()

    const route = proxyquire(
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
    describe('for over-sixteen date', function () {
      it('should call the URL Path Validator', function () {
        return supertest(app)
          .get(ROUTE)
          .set('Cookie', COOKIES)
          .expect(function () {
            sinon.assert.calledOnce(urlPathValidatorStub)
          })
      })

      it('should respond with a 302 and redirect to /apply/first-time/new-eligibility/prisoner-relationship', function () {
        stubDateOfBirth.returns({ encodedDate: DOB, sixteenOrUnder: false })
        return supertest(app)
          .post(ROUTE)
          .set('Cookie', COOKIES)
          .expect(302)
          .expect(function () {
            sinon.assert.calledOnce(stubDateOfBirth)
          })
          .expect('location', '/apply/first-time/new-eligibility/prisoner-relationship')
          .expect(hasSetCookie)
      })

      it('should respond with a 400 for a validation error', function () {
        stubDateOfBirth.throws(new ValidationError())
        return supertest(app)
          .post(ROUTE)
          .set('Cookie', COOKIES)
          .expect(400)
      })

      it('should respond with a 500 for a non-validation error', function () {
        stubDateOfBirth.throws(new Error())
        return supertest(app)
          .post(ROUTE)
          .set('Cookie', COOKIES)
          .expect(500)
      })
    })
  })

  function hasSetCookie (res) {
    if (!JSON.stringify(res.header['set-cookie']).includes('apvs-start-application')) throw new Error('response does not contain expected cookie')
  }
})
