const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/payment-details', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/payment-details?isAdvance=false'
  const VALID_DATA = {
    PaymentMethod: 'bank',
    AccountNumber: '12345678',
    SortCode: '123456'
  }

  let app

  let stubPaymentDetails
  let stubUrlPathValidator
  let stubGetChangeAddressLink

  beforeEach(function () {
    stubPaymentDetails = sinon.stub()
    stubUrlPathValidator = sinon.stub()
    stubGetChangeAddressLink = sinon.stub()

    const route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/payment-details', {
        '../../../../services/domain/payment-details': stubPaymentDetails,
        '../../../../services/validators/url-path-validator': stubUrlPathValidator,
        '../../../helpers/get-change-address-link': stubGetChangeAddressLink
      })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator, get address and get change address link', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(stubUrlPathValidator)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.assert.calledOnce(stubUrlPathValidator)
        })
    })

    it('should respond with a 302 and insert bank details', function () {
      const newPaymentDetails = { paymentMethod: 'bank' }
      stubPaymentDetails.returns(newPaymentDetails)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubPaymentDetails, VALID_DATA.PaymentMethod)
        })
        .expect('location', '/apply/eligibility/claim/bank-payment-details?isAdvance=false')
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 400 if validation fails', function () {
      stubPaymentDetails.throws(new ValidationError({ firstName: {} }))
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })
  })
})
