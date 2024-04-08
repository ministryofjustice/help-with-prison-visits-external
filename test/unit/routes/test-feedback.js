const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const TaskEnums = require('../../../app/constants/tasks-enum')

const ValidationError = require('../../../app/services/errors/validation-error')

describe('routes/feedback', function () {
  const ROUTE = '/feedback'
  const VALID_DATA = {
    rating: 'satisfied',
    improvements: 'This is a test message',
    emailAddress: 'test@test.com'
  }

  let app

  const mockFeedback = jest.fn()
  const mockInsertTask = jest.fn()

  beforeEach(function () {
    mockInsertTask.mockResolvedValue()

    jest.mock('../../../app/services/domain/feedback', () => mockFeedback)
    jest.mock('../../../app/services/data/insert-task', () => mockInsertTask)

    const route = require('../../../app/routes/feedback')
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
      mockFeedback.mockReturnValue(VALID_DATA)
      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          expect(mockFeedback).toHaveBeenCalledWith(VALID_DATA.rating, VALID_DATA.improvements, VALID_DATA.emailAddress)
          expect(mockInsertTask).toHaveBeenCalledWith(null, null, null, TaskEnums.FEEDBACK_SUBMITTED, `${VALID_DATA.rating}~~${VALID_DATA.improvements}~~${VALID_DATA.emailAddress}`)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      mockFeedback.mockImplementation(() => { throw new ValidationError({ rating: {} }) })
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      mockFeedback.mockImplementation(() => { throw new Error() })
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
