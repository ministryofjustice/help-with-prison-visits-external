const supertest = require('supertest')
const routeHelper = require('../../../helpers/routes/route-helper')
const status = require('../../../../app/routes/health-check/status')

describe('routes/health-check/status', () => {
  const ROUTE = '/info'

  let app

  beforeEach(() => {
    app = routeHelper.buildApp(status)
  })

  describe(`GET ${ROUTE}`, () => {
    it('should respond with a 200', () => {
      return supertest(app).get(ROUTE).expect(200)
    })
  })

  // describe('GET /health', () => {
  //   it('should respond with a 200', () => {
  //     return supertest(app)
  //       .get('/health')
  //       .expect(200)
  //       .expect('Content-Type', /application\/json/)
  //   })
  // })
})
