const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const ValidationError = require('../../../../../app/services/errors/validation-error')

var stubDateOfBirth
var app

describe('routes/apply/new-eligibility/date-of-birth', function () {
  const ROUTE = '/apply/first-time/new-eligibility'

  beforeEach(function () {
    stubDateOfBirth = sinon.stub()

    var route = proxyquire(
      '../../../../../app/routes/apply/new-eligibility/date-of-birth', {
        '../../../services/domain/date-of-birth': stubDateOfBirth
      })

    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    describe('for over-sixteen date', function () {
      it('should respond with a 302 and redirect to /apply/first-time/new-eligibility/:dob', function () {
        var dob = '1980-10-10'
        stubDateOfBirth.returns({getDobFormatted: dob, sixteenOrUnder: false})
        return supertest(app)
          .post(ROUTE)
          .expect(302)
          .expect(function () {
            sinon.assert.calledOnce(stubDateOfBirth)
          })
          .expect('location', `/apply/first-time/new-eligibility/${dob}`)
      })

      it('should respond with a 400 for invalid data', function () {
        stubDateOfBirth.throws(new ValidationError({ 'dob': {} }))
        return supertest(app)
          .post(ROUTE)
          .expect(400)
          .expect(function () {
            sinon.assert.calledOnce(stubDateOfBirth)
          })
      })
    })

    describe('sixteen or under date', function () {
      it('should respond with a 302 and redirect to /eligibility-fail', function () {
        stubDateOfBirth.returns({sixteenOrUnder: true})
        return supertest(app)
          .post(ROUTE)
          .expect(302)
          .expect('location', '/eligibility-fail')
      })
    })
  })
})
