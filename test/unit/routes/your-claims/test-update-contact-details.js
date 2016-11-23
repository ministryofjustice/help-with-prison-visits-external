const routeHelper = require('../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

describe('/your-claims/update-contact-details', function () {
  const DOB = '2000-05-15'
  const REFERENCE = 'APVS123'
  const ELIGIBILITYID = '1'
  const ROUTE = `/your-claims/${DOB}/${REFERENCE}/update-contact-details`

  var app
  var urlPathValidatorStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()

    var route = proxyquire('../../../../app/routes/your-claims/update-contact-details', {
      '../../services/validators/url-path-validator': urlPathValidatorStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(`${ROUTE}?eligibility=${ELIGIBILITYID}`)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(`${ROUTE}?eligibility=${ELIGIBILITYID}`)
        .expect(200)
    })
  })
})
