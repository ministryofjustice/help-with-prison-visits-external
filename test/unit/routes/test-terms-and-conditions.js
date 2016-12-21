const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')

describe('routes/terms-and-conditions', function () {
  const ROUTE = `/terms-and-conditions`
  var app

  beforeEach(function () {
    var route = require('../../../app/routes/terms-and-conditions')
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
