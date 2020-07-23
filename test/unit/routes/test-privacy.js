const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')

describe('routes/privacy', function () {
  const ROUTE = '/privacy'
  var app

  beforeEach(function () {
    var route = require('../../../app/routes/privacy')
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
