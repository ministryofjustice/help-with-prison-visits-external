const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../../../app/services/helpers/encrypt')
require('sinon-bluebird')
const paymentMethods = require('../../../../../../app/constants/payment-method-enum')

var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/payment-details-and-declaration', function () {
  const REFERENCE = 'V123456'
  const ENCRYPTED_REFERENCE = encrypt(REFERENCE)
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const ENCRYPTED_REFERENCEID = encrypt(REFERENCEID)
  const CLAIMID = '1'
  const CLAIM_TYPE = 'first-time'
  const ROUTE = `/apply/${CLAIM_TYPE}/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIMID}/payment-details-and-declaration`
  const VALID_DATA = {
    'AccountNumber': '12345678',
    'SortCode': '123456',
    'terms-and-conditions-input': 'yes'
  }

  var app

  var stubPaymentDetails
  var stubInsertBankAccountDetailsForClaim
  var stubSubmitClaim
  var stubUrlPathValidator
  var stubGetAddress

  beforeEach(function () {
    stubPaymentDetails = sinon.stub()
    stubInsertBankAccountDetailsForClaim = sinon.stub()
    stubSubmitClaim = sinon.stub()
    stubUrlPathValidator = sinon.stub()
    stubGetAddress = sinon.stub().resolves()

    var route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/payment-details-and-declaration', {
        '../../../../services/domain/payment-details': stubPaymentDetails,
        '../../../../services/data/insert-bank-account-details-for-claim': stubInsertBankAccountDetailsForClaim,
        '../../../../services/data/submit-claim': stubSubmitClaim,
        '../../../../services/validators/url-path-validator': stubUrlPathValidator,
        '../../../../services/data/get-address': stubGetAddress
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

    it('should respond with a 302 and call submit claim with bank payment', function () {
      var newPaymentDetails = {}
      stubPaymentDetails.returns(newPaymentDetails)
      stubInsertBankAccountDetailsForClaim.resolves()
      stubSubmitClaim.resolves()

      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubPaymentDetails, VALID_DATA.AccountNumber, VALID_DATA.SortCode, VALID_DATA['terms-and-conditions-input'])
          sinon.assert.calledWith(stubInsertBankAccountDetailsForClaim, REFERENCE, ELIGIBILITYID, CLAIMID, newPaymentDetails)
          sinon.assert.calledWith(stubSubmitClaim, REFERENCE, ELIGIBILITYID, CLAIMID, CLAIM_TYPE, undefined, paymentMethods.DIRECT_BANK_PAYMENT.value)
        })
        .expect('location', `/application-submitted/${ENCRYPTED_REFERENCE}`)
    })

    it('should respond with a 302 and call submit claim with payout', function () {
      var newPaymentDetails = {payout: 'on'}
      stubPaymentDetails.returns(newPaymentDetails)
      stubSubmitClaim.resolves()

      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubPaymentDetails, VALID_DATA.AccountNumber, VALID_DATA.SortCode, VALID_DATA['terms-and-conditions-input'])
          sinon.assert.notCalled(stubInsertBankAccountDetailsForClaim)
          sinon.assert.calledWith(stubSubmitClaim, REFERENCE, ELIGIBILITYID, CLAIMID, CLAIM_TYPE, undefined, paymentMethods.PAYOUT.value)
        })
        .expect('location', `/application-submitted/${ENCRYPTED_REFERENCE}`)
    })

    it('should use assisted digital cookie value', function () {
      var assistedDigitalCaseWorker = 'a@b.com'
      stubPaymentDetails.returns({})
      stubInsertBankAccountDetailsForClaim.resolves()
      stubSubmitClaim.resolves()

      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .set('Cookie', [`apvs-assisted-digital=${assistedDigitalCaseWorker}`])
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubSubmitClaim, REFERENCE, ELIGIBILITYID, CLAIMID, CLAIM_TYPE, assistedDigitalCaseWorker, paymentMethods.DIRECT_BANK_PAYMENT.value)
        })
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

    it('should respond with a 500 if promise rejects on submitting claim.', function () {
      var newPaymentDetails = {payout: 'on'}
      stubPaymentDetails.returns(newPaymentDetails)
      stubSubmitClaim.rejects()
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
