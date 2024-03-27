const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')

const ValidationError = require('../../../app/services/errors/validation-error')

describe('routes/help', function () {
  const ROUTE = '/help'
  const VALID_DATA = {
    name: 'Joe Bloggs',
    emailAddress: 'test@test.com',
    referenceNumber: '',
    'date-of-claim-day': undefined,
    'date-of-claim-month': undefined,
    'date-of-claim-year': undefined,
    issue: 'Testing problems are occuring'
  }

  let app
  let mockAxios
  let mockConfig
  const mockTechnicalHelp = jest.fn()
  const mockPost = jest.fn()

  beforeEach(function () {
    mockPost.mockResolvedValue({
      status: 201,
      data: {
        ticket: {
          id: '123'
        }
      }
    })

    mockAxios = {
      post: mockPost
    }

    mockConfig = {
      ZENDESK_ENABLED: 'true',
      ZENDESK_PROD_ENVIRONMENT: 'true',
      ZENDESK_API_URL: 'http://test/',
      ZENDESK_EMAIL_ADDRESS: 'nota@realem.mail',
      ZENDESK_API_KEY: '123'
    }

    jest.mock('../../../app/services/domain/technical-help', () => mockTechnicalHelp)
    jest.mock('../../../app/config', () => mockConfig)
    jest.mock('axios', () => mockAxios)

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

  describe(`POST ${ROUTE}`, function () {
    it('should respond with a 302', function () {
      mockTechnicalHelp.mockReturnValue(VALID_DATA)
      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          expect(mockTechnicalHelp).hasBeenCalledWith(VALID_DATA.name, VALID_DATA.emailAddress, VALID_DATA.referenceNumber, VALID_DATA.day, VALID_DATA.month, VALID_DATA.year, VALID_DATA.issue)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      mockTechnicalHelp.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if a non-validation error occurs.', function () {
      mockTechnicalHelp.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
