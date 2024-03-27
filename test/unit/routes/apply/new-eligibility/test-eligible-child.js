const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const ValidationError = require('../../../../../app/services/errors/validation-error')

const mockUrlPathValidator = jest.fn()
const mockEligibleChild = jest.fn()
const mockInsertEligibleChild = jest.fn()
let app

describe('routes/apply/new-eligibility/eligible-child', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI2MzM1MjEwLjU5NDQ2NjY2OCwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InIxNCIsImJlbmVmaXQiOiJiMSIsImJlbmVmaXRPd25lciI6InllcyIsInJlZmVyZW5jZUlkIjoiNDI0MzcwMWVhYWM3NGRhNzBiYTg4ZmIyIiwiZGVjcnlwdGVkUmVmIjoiSDU3UFYxRCJ9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/eligible-child'

  beforeEach(function () {
    jest.mock(
      '../../../../../app/services/data/insert-eligible-child',
      () => mockInsertEligibleChild
    )
    jest.mock('../../../../../app/services/domain/eligible-child', () => mockEligibleChild)
    jest.mock(
      '../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )

    const route = require('../../../../../app/routes/apply/new-eligibility/eligible-child')

    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should persist data and redirect to first-time/about-you for valid data', function () {
      const newEligibleChild = {}
      mockEligibleChild.mockReturnValue(newEligibleChild)
      mockInsertEligibleChild.mockResolvedValue({ reference: 'NEWREF1', eligibilityId: 1234 })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
          expect(mockEligibleChild).toHaveBeenCalledTimes(1)
          expect(mockInsertEligibleChild).toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/first-time/new-eligibility/about-you')
    })

    it('should persist data and redirect to /apply/first-time/new-eligibility/date-of-birth?error=expired', function () {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newEligibleChild = {}
      mockEligibleChild.mockReturnValue(newEligibleChild)
      mockInsertEligibleChild.mockResolvedValue({ reference: newReference, eligibilityId: newEligibilityId })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should respond with a 400 for invalid data', function () {
      mockEligibleChild.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      mockEligibleChild.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockInsertEligibleChild.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
