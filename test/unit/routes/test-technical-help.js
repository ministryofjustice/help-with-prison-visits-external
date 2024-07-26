const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')

describe('routes/help', function () {
  const ROUTE = '/help'

  let app

  beforeEach(function () {
    const route = require('../../../app/routes/technical-help')

    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })
})
