const supertest = require('supertest')
const routeHelper = require('../../helpers/routes/route-helper')

describe('routes/help', () => {
  const ROUTE = '/help'

  let app

  beforeEach(() => {
    const route = require('../../../app/routes/technical-help')

    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, () => {
    it('should respond with a 200', () => {
      return supertest(app).get(ROUTE).expect(200)
    })
  })
})
