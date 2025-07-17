const supertest = require('supertest')
const routeHelper = require('../../../helpers/routes/route-helper')
const ValidationError = require('../../../../app/services/errors/validation-error')

describe('/your-claims/update-contact-details', () => {
  const COOKIES = [
    'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MjM3LjI5MDYxNjY2NSwiZGVjcnlwdGVkUmVmIjoiUUhRQ1hXWiIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QkMiLCJlbGlnaWJpbGl0eUlkIjoxfQ==',
  ]
  const ROUTE = '/your-claims/update-contact-details'

  let app
  const mockUrlPathValidator = jest.fn()
  const mockUpdatedContactDetails = jest.fn()
  const mockInsertEligibilityVisitorUpdatedContactDetail = jest.fn()

  beforeEach(() => {
    jest.mock('../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)
    jest.mock('../../../../app/services/domain/updated-contact-details', () => mockUpdatedContactDetails)
    jest.mock(
      '../../../../app/services/data/insert-eligibility-visitor-updated-contact-detail',
      () => mockInsertEligibilityVisitorUpdatedContactDetail,
    )

    const route = require('../../../../app/routes/your-claims/update-contact-details')
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

    it('should respond with a 200', () => {
      return supertest(app).get(ROUTE).set('Cookie', COOKIES).expect(200)
    })
  })

  describe(`POST ${ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
      mockUpdatedContactDetails.mockReturnValue({})
      mockInsertEligibilityVisitorUpdatedContactDetail.mockResolvedValue({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 and redirect to /your-claims/check-your-information', () => {
      mockUpdatedContactDetails.mockReturnValue({})
      mockInsertEligibilityVisitorUpdatedContactDetail.mockResolvedValue({})

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send({ 'email-address': 'test@test.com', 'phone-number': '5553425172' })
        .expect(302)
        .expect(() => {
          expect(mockUpdatedContactDetails).toHaveBeenCalledTimes(1)
          expect(mockInsertEligibilityVisitorUpdatedContactDetail).toHaveBeenCalledTimes(1)
        })
        .expect('location', '/your-claims/check-your-information')
    })

    it('should respond with a 400 for a validation error', () => {
      mockUpdatedContactDetails.mockImplementation(() => {
        throw new ValidationError()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(400)
    })

    it('should respond with a 500 for a non-validation error', () => {
      mockUpdatedContactDetails.mockImplementation(() => {
        throw new Error()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockInsertEligibilityVisitorUpdatedContactDetail.mockRejectedValue()
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })
})
