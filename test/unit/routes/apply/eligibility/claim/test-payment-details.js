const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../../../app/services/helpers/encrypt')
require('sinon-bluebird')
const paymentMethods = require('../../../../../../app/constants/payment-method-enum')

var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/payment-details', function () {
  const REFERENCE = 'V123456'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const ENCRYPTED_REFERENCEID = encrypt(REFERENCEID)
  const CLAIMID = '1'
  const CLAIM_TYPE = 'first-time'
  const ROUTE = `/apply/${CLAIM_TYPE}/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIMID}/payment-details?isAdvance=false`
  const VALID_DATA = {
    'PaymentMethod': 'bank',
    'AccountNumber': '12345678',
    'SortCode': '123456'
  }

  var app

  var stubPaymentDetails
  var stubInsertBankAccountDetailsForClaim
  var stubUrlPathValidator
  var stubGetAddressAndLinkDetails

  beforeEach(function () {
    stubPaymentDetails = sinon.stub()
    stubInsertBankAccountDetailsForClaim = sinon.stub()
    stubUrlPathValidator = sinon.stub()
    stubGetAddressAndLinkDetails = sinon.stub().resolves()

    var route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/payment-details', {
        '../../../../services/domain/payment-details': stubPaymentDetails,
        '../../../../services/data/insert-bank-account-details-for-claim': stubInsertBankAccountDetailsForClaim,
        '../../../../services/validators/url-path-validator': stubUrlPathValidator,
        '../../../../services/data/get-address-and-link-details': stubGetAddressAndLinkDetails
      })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(stubUrlPathValidator)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(stubUrlPathValidator)
        })
    })

    it('should respond with a 302 and insert bank details', function () {
      var newPaymentDetails = {paymentMethod: 'bank'}
      stubPaymentDetails.returns(newPaymentDetails)
      stubInsertBankAccountDetailsForClaim.resolves()

      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubPaymentDetails, VALID_DATA.PaymentMethod, VALID_DATA.AccountNumber, VALID_DATA.SortCode)
          sinon.assert.calledWith(stubInsertBankAccountDetailsForClaim, REFERENCE, ELIGIBILITYID, CLAIMID, newPaymentDetails)
        })
        .expect('location', `/apply/${CLAIM_TYPE}/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIMID}/declaration?isAdvance=false&paymentMethod=${paymentMethods.DIRECT_BANK_PAYMENT.value}`)
    })

    it('should respond with a 302 not submit bank details', function () {
      var newPaymentDetails = {paymentMethod: 'payout'}
      stubPaymentDetails.returns(newPaymentDetails)

      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubPaymentDetails, VALID_DATA.PaymentMethod, VALID_DATA.AccountNumber, VALID_DATA.SortCode)
          sinon.assert.notCalled(stubInsertBankAccountDetailsForClaim)
        })
        .expect('location', `/apply/${CLAIM_TYPE}/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIMID}/declaration?isAdvance=false&paymentMethod=${paymentMethods.PAYOUT.value}`)
    })

    it('should respond with a 400 if validation fails', function () {
      stubPaymentDetails.throws(new ValidationError({ 'firstName': {} }))
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects inserting bank details.', function () {
      stubInsertBankAccountDetailsForClaim.rejects()
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
