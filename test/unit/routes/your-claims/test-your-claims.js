const expect = require('chai').expect
const routeHelper = require('../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

describe('/your-claims/your-claims', function () {
  const DOB = '2000-05-15'
  const REFERENCE = 'APVS123'
  const ROUTE = `/your-claims/${DOB}/${REFERENCE}`

  const CLAIMS_CAN_START_NEW_CLAIM = [{Status: 'APPROVED'}, {Status: 'AUTO-APPROVED'}, {Status: 'REJECTED'}]
  const CLAIMS_CANNOT_START_NEW_CLAIM = [{Status: 'INPROGRESS'}]

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
      getHistoricClaimsStub.resolves(CLAIMS_CAN_START_NEW_CLAIM)
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })

    it('should set canStartNewClaim to true if no claims in progress', function () {
      getHistoricClaimsStub.resolves(CLAIMS_CAN_START_NEW_CLAIM)
      return supertest(app)
        .get(ROUTE)
        .expect(function (response) {
          expect(response.text).to.contain('"canStartNewClaim":true')
        })
    })

    it('should set canStartNewClaim to false if claims in progress', function () {
      getHistoricClaimsStub.resolves(CLAIMS_CANNOT_START_NEW_CLAIM)
      return supertest(app)
        .get(ROUTE)
        .expect(function (response) {
          expect(response.text).to.contain('"canStartNewClaim":false')
        })
    })

    it('should respond with a 302 and redirect if passed a non-matching reference number dob combination', function () {
      getHistoricClaimsStub.resolves([])
      return supertest(app)
        .get(ROUTE)
        .expect(302)
        .expect('location', '/start-already-registered?error=yes')
    })
  })
})
