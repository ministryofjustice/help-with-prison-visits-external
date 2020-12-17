const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const route = require('../../../app/routes/cookies')

describe('routes/cookies', function () {
  const ROUTE = '/cookies'

  let app

  beforeEach(function () {
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
