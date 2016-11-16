const routeHelper = require('../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

describe('/your-claims/your-claims', function () {
  const DOB = '2000-05-15'
  const REFERENCE = 'APVS123'
  const ROUTE = `/your-claims/${DOB}/${REFERENCE}`

  var app

  var urlPathValidatorStub
  var getHistoricClaimsStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    getHistoricClaimsStub = sinon.stub()

    var route = proxyquire('../../../../app/routes/your-claims/your-claims', {
      '../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../services/data/get-historic-claims': getHistoricClaimsStub
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

    it('should respond with a 200 if the database query returns a result', function () {
      getHistoricClaimsStub.resolves([''])
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })

    it('should respond with a 302 if passed a non-matching reference number', function () {
      getHistoricClaimsStub.resolves([])
      return supertest(app)
        .get(ROUTE)
        .expect(302)
    })

    it('should redirect to the start page with error query string set if passed a non-matching reference number', function () {
      getHistoricClaimsStub.resolves([])
      return supertest(app)
        .get(ROUTE)
        .expect('location', '/start?error=yes')
    })
  })
})
