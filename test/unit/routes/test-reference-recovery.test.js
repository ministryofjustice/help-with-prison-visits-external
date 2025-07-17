const supertest = require('supertest')
const routeHelper = require('../../helpers/routes/route-helper')
const TaskEnums = require('../../../app/constants/tasks-enum')

const ValidationError = require('../../../app/services/errors/validation-error')

describe('routes/reference-recovery', () => {
  const ROUTE = '/reference-recovery'
  const VALID_DATA = {
    EmailAddress: 'test@test.com',
    PrisonerNumber: 'B7328973',
  }

  let app

  const mockReferenceRecovery = jest.fn()
  const mockInsertTask = jest.fn()

  beforeEach(() => {
    mockInsertTask.mockResolvedValue()

    jest.mock('../../../app/services/domain/reference-recovery', () => mockReferenceRecovery)
    jest.mock('../../../app/services/data/insert-task', () => mockInsertTask)

    const route = require('../../../app/routes/reference-recovery')
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

  describe(`POST ${ROUTE}`, () => {
    it('should respond with a 302', () => {
      mockReferenceRecovery.mockReturnValue(VALID_DATA)
      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(() => {
          expect(mockReferenceRecovery).toHaveBeenCalledWith(VALID_DATA.EmailAddress, VALID_DATA.PrisonerNumber)
          expect(mockInsertTask).toHaveBeenCalledWith(
            null,
            null,
            null,
            TaskEnums.REFERENCE_RECOVERY,
            `${VALID_DATA.EmailAddress}~~${VALID_DATA.PrisonerNumber}`,
          )
        })
    })

    it('should respond with a 400 if validation fails', () => {
      mockReferenceRecovery.mockImplementation(() => {
        throw new ValidationError({ EmailAddress: {} })
      })
      return supertest(app).post(ROUTE).expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', () => {
      mockReferenceRecovery.mockImplementation(() => {
        throw new Error()
      })
      return supertest(app).post(ROUTE).expect(500)
    })
  })
})
