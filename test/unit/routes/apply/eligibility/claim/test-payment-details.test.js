const supertest = require('supertest')
const routeHelper = require('../../../../../helpers/routes/route-helper')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/payment-details', () => {
  const COOKIES = [
    'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9',
  ]
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/payment-details?isAdvance=false'
  const VALID_DATA = {
    PaymentMethod: 'bank',
    AccountNumber: '12345678',
    SortCode: '123456',
  }

  let app

  const mockPaymentDetails = jest.fn()
  const mockUrlPathValidator = jest.fn()
  const mockGetChangeAddressLink = jest.fn()

  beforeEach(() => {
    jest.mock('../../../../../../app/services/domain/payment-details', () => mockPaymentDetails)
    jest.mock('../../../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)
    jest.mock('../../../../../../app/routes/helpers/get-change-address-link', () => mockGetChangeAddressLink)

    const route = require('../../../../../../app/routes/apply/eligibility/claim/payment-details')
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, () => {
    it('should call the URL Path Validator, get address and get change address link', () => {
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
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 and insert bank details', () => {
      const newPaymentDetails = { paymentMethod: 'bank' }
      mockPaymentDetails.mockReturnValue(newPaymentDetails)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send(VALID_DATA)
        .expect(302)
        .expect(() => {
          expect(mockPaymentDetails).toHaveBeenCalledWith(VALID_DATA.PaymentMethod)
        })
        .expect('location', '/apply/eligibility/claim/bank-payment-details?isAdvance=false')
    })

    it('should redirect to date-of-birth error page if cookie is expired', () => {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 400 if validation fails', () => {
      mockPaymentDetails.mockImplementation(() => {
        throw new ValidationError({ firstName: {} })
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(400)
    })
  })
})
