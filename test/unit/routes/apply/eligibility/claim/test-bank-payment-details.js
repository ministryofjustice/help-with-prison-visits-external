const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/bank-payment-details', function () {
  const COOKIES = [ 'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9' ]
  const COOKIES_EXPIRED = [ 'apvs-start-application=' ]
  const ROUTE = `/apply/eligibility/claim/bank-payment-details?isAdvance=false`
  const VALID_DATA = {
    'AccountNumber': '12345678',
    'SortCode': '123456'
  }

  var app

  var stubBankAccountDetails
  var stubInsertBankAccountDetailsForClaim
  var stubUrlPathValidator

  beforeEach(function () {
    stubBankAccountDetails = sinon.stub()
    stubInsertBankAccountDetailsForClaim = sinon.stub()
    stubUrlPathValidator = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/bank-payment-details', {
        '../../../../services/domain/bank-account-details': stubBankAccountDetails,
        '../../../../services/data/insert-bank-account-details-for-claim': stubInsertBankAccountDetailsForClaim,
        '../../../../services/validators/url-path-validator': stubUrlPathValidator
      })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
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
      var newPaymentDetails = {paymentMethod: 'bank'}
      stubBankAccountDetails.returns(newPaymentDetails)
      stubInsertBankAccountDetailsForClaim.resolves()

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubBankAccountDetails, VALID_DATA.AccountNumber, VALID_DATA.SortCode)
        })
        .expect('location', `/apply/eligibility/claim/declaration?isAdvance=false`)
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 400 if validation fails', function () {
      stubBankAccountDetails.throws(new ValidationError({ 'firstName': {} }))
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects inserting bank details.', function () {
      stubInsertBankAccountDetailsForClaim.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
