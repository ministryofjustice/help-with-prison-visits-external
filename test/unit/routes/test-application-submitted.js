const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')

jest.mock('../services/validators/url-path-validator', () => urlPathValidatorStub);

describe('routes/application-submitted', function () {
  const ROUTE = '/application-submitted'
  let app
  let urlPathValidatorStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()

    const route = require('../../../app/routes/application-submitted')
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })
})
