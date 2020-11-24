const routeHelper = require('../../../helpers/routes/route-helper')
const supertest = require('supertest')
const status = require('../../../../app/routes/health-check/status')

describe('routes/health-check/status', function () {
  const ROUTE = '/status'

  let app

  beforeEach(function () {
    app = routeHelper.buildApp(status)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })
})
