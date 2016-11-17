const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../app/services/errors/validation-error')
const claimTypeEnum = require('../../../app/constants/claim-type-enum')

describe('routes/start', function () {
  const ROUTE = '/start'
  const FIRST_TIME_ROUTE = '/start-first-time'
  const ALREADY_REGISTERED_ROUTE = '/start-already-registered'

  var app

  var alreadyRegisteredStub

  beforeEach(function () {
    alreadyRegisteredStub = sinon.stub()

    var route = proxyquire('../../../app/routes/start', {
      '../services/domain/already-registered': alreadyRegisteredStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200 if the error query parameter is not set', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })

    it('should respond with a 200 if the error query paramater is set', function () {
      return supertest(app)
        .get(ROUTE)
        .query('error=yes')
        .expect(200)
    })
  })

  describe(`POST ${FIRST_TIME_ROUTE}`, function () {
    it('should respond with a 302 and redirect to the correct location', function () {
      return supertest(app)
        .post(FIRST_TIME_ROUTE)
        .expect(302)
        .expect('location', `/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility`)
    })
  })

  describe(`POST ${ALREADY_REGISTERED_ROUTE}`, function () {
    const REFERENCE = 'APVS123'
    const DOB = '2015-05-15'
    const ALREADY_REGISTERED = { getDobFormatted: DOB }

    it('should respond with a 302 if domain object is built successfully', function () {
      return supertest(app)
        .post(ALREADY_REGISTERED_ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(alreadyRegisteredStub)
        })
        .expect(302)
    })

    it('should redirect to the your-claims page with the reference and the dob set in the domain object', function () {
      alreadyRegisteredStub.returns(ALREADY_REGISTERED)
      return supertest(app)
        .post(ALREADY_REGISTERED_ROUTE)
        .send({
          reference: REFERENCE
        })
        .expect('location', `/your-claims/${DOB}/${REFERENCE}`)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      alreadyRegisteredStub.throws(new ValidationError())
      return supertest(app)
        .post(ALREADY_REGISTERED_ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      alreadyRegisteredStub.throws(new Error())
      return supertest(app)
        .post(ALREADY_REGISTERED_ROUTE)
        .expect(500)
    })
  })
})
