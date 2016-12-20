const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')

describe('routes/feedback', function () {
  const ROUTE = `/feedback`
  var app

  beforeEach(function () {
    var route = proxyquire('../../../app/routes/application-submitted', {
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
})
