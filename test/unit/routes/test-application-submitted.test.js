const supertest = require('supertest')
const routeHelper = require('../../helpers/routes/route-helper')

describe('routes/application-submitted', () => {
  const ROUTE = '/application-submitted'
  let app
  const mockUrlPathValidator = jest.fn()

  beforeEach(() => {
    jest.mock('../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)

    const route = require('../../../app/routes/application-submitted')
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
      return supertest(app)
        .get(ROUTE)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200', () => {
      return supertest(app).get(ROUTE).expect(200)
    })
  })
})
