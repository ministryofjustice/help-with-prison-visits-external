const supertest = require('supertest')
const routeHelper = require('../../helpers/routes/route-helper')
const route = require('../../../app/routes/eligibility-fail')

describe('routes/eligibility-fail', () => {
  const ROUTE = '/eligibility-fail'

  let app

  beforeEach(() => {
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, () => {
    it('should respond with a 200', () => {
      return supertest(app).get(ROUTE).expect(200)
    })
  })
})
