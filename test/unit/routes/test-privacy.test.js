const supertest = require('supertest')
const routeHelper = require('../../helpers/routes/route-helper')

describe('routes/privacy', () => {
  const ROUTE = '/privacy'
  let app

  beforeEach(() => {
    const route = require('../../../app/routes/privacy')
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, () => {
    it('should respond with a 200', () => {
      return supertest(app).get(ROUTE).expect(200)
    })
  })
})
