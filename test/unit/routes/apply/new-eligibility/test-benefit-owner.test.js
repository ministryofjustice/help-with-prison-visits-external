const supertest = require('supertest')
const routeHelper = require('../../../../helpers/routes/route-helper')
const ValidationError = require('../../../../../app/services/errors/validation-error')

const mockUrlPathValidator = jest.fn()
const mockBenefitOwner = jest.fn()
const mockInsertBenefitOwner = jest.fn()
let app

describe('routes/apply/new-eligibility/benefit-owner', () => {
  const COOKIES = [
    'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI1OTQ4MTE0Ljg5MDAxNjY2OCwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InIxIiwiYmVuZWZpdCI6ImIxIiwiYmVuZWZpdE93bmVyIjoibm8iLCJyZWZlcmVuY2VJZCI6IjMzM2UxMzBjY2JiYjQ4YTcwYWFiOGFiNCIsImRlY3J5cHRlZFJlZiI6IjlIVEI3TUEifQ==',
  ]
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/benefit-owner'

  beforeEach(() => {
    jest.mock('../../../../../app/services/data/insert-benefit-owner', () => mockInsertBenefitOwner)
    jest.mock('../../../../../app/services/domain/benefit-owner', () => mockBenefitOwner)
    jest.mock('../../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)

    const route = require('../../../../../app/routes/apply/new-eligibility/benefit-owner')

    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })
  })

  describe(`POST ${ROUTE}`, () => {
    it('should persist data and redirect to first-time/about-you for valid data', () => {
      const newBenefitOwner = {}
      mockInsertBenefitOwner.mockResolvedValue({ reference: 'NEWREF1', eligibilityId: 1234 })
      mockBenefitOwner.mockReturnValue(newBenefitOwner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
          expect(mockBenefitOwner).toHaveBeenCalledTimes(1)
          expect(mockInsertBenefitOwner).toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/first-time/new-eligibility/about-you')
    })

    it('should persist data and redirect to /apply/first-time/benefit-owner?error=expired', () => {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newBenefitOwner = {}
      mockBenefitOwner.mockReturnValue(newBenefitOwner)
      mockInsertBenefitOwner.mockResolvedValue({ reference: newReference, eligibilityId: newEligibilityId })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should respond with a 400 for invalid data', () => {
      mockBenefitOwner.mockImplementation(() => {
        throw new ValidationError()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(400)
    })

    it('should respond with a 500 for a non-validation error', () => {
      mockBenefitOwner.mockImplementation(() => {
        throw new Error()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockInsertBenefitOwner.mockRejectedValue()
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })
})
