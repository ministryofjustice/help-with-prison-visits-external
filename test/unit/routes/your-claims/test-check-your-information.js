const routeHelper = require('../../../helpers/routes/route-helper')
const ValidationError = require('../../../../app/services/errors/validation-error')
const supertest = require('supertest')

describe('/your-claims/check-your-information', function () {
  const REFERENCE = 'APVS123'
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MTgzLjA0MjMzMzMzNSwiZGVjcnlwdGVkUmVmIjoiUUhRQ1hXWiIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QkMifQ==']
  const ROUTE = '/your-claims/check-your-information'

  let app

  const mockUrlPathValidator = jest.fn()
  const mockDecrypt = jest.fn()
  const mockGetRepeatEligibility = jest.fn()
  const mockCheckYourInformation = jest.fn()

  beforeEach(function () {
    mockDecrypt.mockReturnValue(REFERENCE)

    jest.mock('../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)
    jest.mock('../../../../app/services/helpers/decrypt', () => mockDecrypt)
    jest.mock('../../../../app/services/data/get-repeat-eligibility', () => mockGetRepeatEligibility)
    jest.mock('../../../../app/services/domain/check-your-information', () => mockCheckYourInformation)

    const route = require('../../../../app/routes/your-claims/check-your-information')
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

    it('should call to get masked eligibility and respond with a 200', function () {
      mockGetRepeatEligibility.mockResolvedValue({})
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          expect(mockGetRepeatEligibility).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockGetRepeatEligibility.mockRejectedValue()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 and redirect to /apply/eligibility/new-claim/future-or-past-visit', function () {
      mockCheckYourInformation.mockReturnValue({})
      mockGetRepeatEligibility.mockResolvedValue({ NameOfPrison: 'hewell', Country: 'England' })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          expect(mockCheckYourInformation).toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/eligibility/new-claim/future-or-past-visit')
    })

    it('should respond with a 302 and redirect to /apply/eligibility/new-claim/future-or-past-visit if prison GB and Country NI', function () {
      mockCheckYourInformation.mockReturnValue({})
      mockGetRepeatEligibility.mockResolvedValue({ NameOfPrison: 'hewell', Country: 'Northern Ireland' })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          expect(mockCheckYourInformation).toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/eligibility/new-claim/future-or-past-visit')
    })

    it('should redirect to /apply/eligibility/new-claim/same-journey-as-last-claim for Northern Ireland prison and Country', function () {
      mockCheckYourInformation.mockReturnValue({})
      mockGetRepeatEligibility.mockResolvedValue({ NameOfPrison: 'maghaberry', Country: 'Northern Ireland' })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          expect(mockCheckYourInformation).toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/eligibility/new-claim/same-journey-as-last-claim')
    })

    it('should respond with a 400 for a validation error', function () {
      mockCheckYourInformation.mockImplementation(() => { throw new ValidationError() })
      mockGetRepeatEligibility.mockResolvedValue({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(function () {
          expect(mockGetRepeatEligibility).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockCheckYourInformation.mockImplementation(() => { throw new ValidationError() })
      mockGetRepeatEligibility.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 for a non-validation error', function () {
      mockCheckYourInformation.mockImplementation(() => { throw new Error() })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockGetRepeatEligibility.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
