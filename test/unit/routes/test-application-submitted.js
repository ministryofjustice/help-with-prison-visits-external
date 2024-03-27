const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')

describe('routes/application-submitted', function () {
  const ROUTE = '/application-submitted'
  let app
  const mockUrlPathValidator = jest.fn()

  beforeEach(function () {
    jest.mock('../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)

    const route = require('../../../app/routes/application-submitted')
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })
})
