const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../../../app/services/helpers/encrypt')
require('sinon-bluebird')

var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/bank-account-details', function () {
  const REFERENCE = 'V123456'
  const ENCRYPTED_REFERENCE = encrypt(REFERENCE)
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const ENCRYPTED_REFERENCEID = encrypt(REFERENCEID)
  const CLAIMID = '1'
  const CLAIM_TYPE = 'first-time'
  const ROUTE = `/apply/${CLAIM_TYPE}/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIMID}/bank-account-details`
  const VALID_DATA = {
    'AccountNumber': '12345678',
    'SortCode': '123456',
    'terms-and-conditions-input': 'yes'
  }

  var app

  var stubBankAccountDetails
  var stubInsertBankAccountDetailsForClaim
  var stubSubmitClaim
  var stubUrlPathValidator

  beforeEach(function () {
    stubBankAccountDetails = sinon.stub()
    stubInsertBankAccountDetailsForClaim = sinon.stub()
    stubSubmitClaim = sinon.stub()
    stubUrlPathValidator = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/bank-account-details', {
        '../../../../services/domain/bank-account-details': stubBankAccountDetails,
        '../../../../services/data/insert-bank-account-details-for-claim': stubInsertBankAccountDetailsForClaim,
        '../../../../services/data/submit-claim': stubSubmitClaim,
        '../../../../services/validators/url-path-validator': stubUrlPathValidator
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

    it('should respond with a 302', function () {
      var newBankAccountDetails = {}
      stubBankAccountDetails.returns(newBankAccountDetails)
      stubInsertBankAccountDetailsForClaim.resolves()
      stubSubmitClaim.resolves()

      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubBankAccountDetails, VALID_DATA.AccountNumber, VALID_DATA.SortCode, VALID_DATA['terms-and-conditions-input'])
          sinon.assert.calledWith(stubInsertBankAccountDetailsForClaim, REFERENCE, ELIGIBILITYID, CLAIMID, newBankAccountDetails)
          sinon.assert.calledWith(stubSubmitClaim, REFERENCE, ELIGIBILITYID, CLAIMID, CLAIM_TYPE, undefined)
        })
        .expect('location', `/application-submitted/${ENCRYPTED_REFERENCE}`)
    })

    it('should use assisted digital cookie value', function () {
      var assistedDigitalCaseWorker = 'a@b.com'
      stubBankAccountDetails.returns({})
      stubInsertBankAccountDetailsForClaim.resolves()
      stubSubmitClaim.resolves()

      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .set('Cookie', [`apvs-assisted-digital=${assistedDigitalCaseWorker}`])
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubSubmitClaim, REFERENCE, ELIGIBILITYID, CLAIMID, CLAIM_TYPE, assistedDigitalCaseWorker)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      stubBankAccountDetails.throws(new ValidationError({ 'firstName': {} }))
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })
  })
})
