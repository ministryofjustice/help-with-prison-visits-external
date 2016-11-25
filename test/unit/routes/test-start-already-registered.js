const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../app/services/errors/validation-error')

describe('routes/start-already-registered', function () {
  const ROUTE = '/start-already-registered'

  var app

  var alreadyRegisteredStub

  beforeEach(function () {
    alreadyRegisteredStub = sinon.stub()

    var route = proxyquire('../../../app/routes/start-already-registered', {
      '../services/domain/already-registered': alreadyRegisteredStub
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
    const REFERENCE = 'APVS123'
    const DOB = '2015-05-15'
    const ALREADY_REGISTERED = { getDobFormatted: DOB }

    it('should respond with a 302 if domain object is built successfully', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(alreadyRegisteredStub)
        })
        .expect(302)
    })

    it('should redirect to the your-claims page with the reference and the dob set in the domain object', function () {
      alreadyRegisteredStub.returns(ALREADY_REGISTERED)
      return supertest(app)
        .post(ROUTE)
        .send({
          reference: REFERENCE
        })
        .expect('location', `/your-claims/${DOB}/${REFERENCE}`)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      alreadyRegisteredStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      alreadyRegisteredStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
