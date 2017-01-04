const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../app/services/helpers/encrypt')
require('sinon-bluebird')

describe('routes/application-submitted', function () {
  const ENCRYPTED_REFERENCE = encrypt('RA2E0QZ')
  const ROUTE = `/application-submitted/${ENCRYPTED_REFERENCE}`
  var app
  var urlPathValidatorStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()

    var route = proxyquire('../../../app/routes/application-submitted', {
      '../services/validators/url-path-validator': urlPathValidatorStub
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
})
