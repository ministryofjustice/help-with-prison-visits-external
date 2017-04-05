const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../../../app/services/helpers/encrypt')
require('sinon-bluebird')
const paymentMethods = require('../../../../../../app/constants/payment-method-enum')

var ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/declaration', function () {
  const REFERENCE = 'V123456'
  const ENCRYPTED_REFERENCE = encrypt(REFERENCE)
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const ENCRYPTED_REFERENCEID = encrypt(REFERENCEID)
  const CLAIMID = '1'
  const CLAIM_TYPE = 'first-time'
  const ROUTE = `/apply/${CLAIM_TYPE}/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIMID}/declaration`
  const VALID_DATA = {
    'terms-and-conditions-input': 'yes'
  }

  var app

  var stubDeclaration
  var stubSubmitClaim
  var stubUrlPathValidator
  var stubGetIsAdvanceClaim
  var stubCheckStatusForFinishingClaim

  beforeEach(function () {
    stubDeclaration = sinon.stub()
    stubSubmitClaim = sinon.stub()
    stubUrlPathValidator = sinon.stub()
    stubGetIsAdvanceClaim = sinon.stub()
    stubCheckStatusForFinishingClaim = sinon.stub()

    var route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/declaration', {
        '../../../../services/domain/declaration': stubDeclaration,
        '../../../../services/data/submit-claim': stubSubmitClaim,
        '../../../../services/validators/url-path-validator': stubUrlPathValidator,
        '../../../../services/data/get-is-advance-claim': stubGetIsAdvanceClaim,
        '../../../../services/data/check-status-for-finishing-claim': stubCheckStatusForFinishingClaim
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

    it('should respond with a 302 and call submit claim and put past in route', function () {
      stubDeclaration.returns()
      stubSubmitClaim.resolves()
      stubGetIsAdvanceClaim.resolves(false)
      stubCheckStatusForFinishingClaim.resolves(true)

      return supertest(app)
        .post(`${ROUTE}?paymentMethod=${paymentMethods.DIRECT_BANK_PAYMENT.value}`)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubDeclaration, VALID_DATA['terms-and-conditions-input'])
          sinon.assert.calledWith(stubCheckStatusForFinishingClaim, REFERENCE, ELIGIBILITYID, CLAIMID)
          sinon.assert.calledWith(stubSubmitClaim, REFERENCE, ELIGIBILITYID, CLAIMID, CLAIM_TYPE, undefined, paymentMethods.DIRECT_BANK_PAYMENT.value)
          sinon.assert.calledWith(stubGetIsAdvanceClaim, CLAIMID)
        })
        .expect('location', `/application-submitted/past/${ENCRYPTED_REFERENCE}`)
    })

    it('should respond with a 302 and call submit claim with payout and advance in route', function () {
      stubDeclaration.returns()
      stubSubmitClaim.resolves()
      stubGetIsAdvanceClaim.resolves(true)
      stubCheckStatusForFinishingClaim.resolves(true)

      return supertest(app)
        .post(`${ROUTE}?paymentMethod=${paymentMethods.PAYOUT.value}`)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubDeclaration, VALID_DATA['terms-and-conditions-input'])
          sinon.assert.calledWith(stubCheckStatusForFinishingClaim, REFERENCE, ELIGIBILITYID, CLAIMID)
          sinon.assert.calledWith(stubSubmitClaim, REFERENCE, ELIGIBILITYID, CLAIMID, CLAIM_TYPE, undefined, paymentMethods.PAYOUT.value)
          sinon.assert.calledWith(stubGetIsAdvanceClaim, CLAIMID)
        })
        .expect('location', `/application-submitted/advance/${ENCRYPTED_REFERENCE}`)
    })

    it('should use assisted digital cookie value', function () {
      var assistedDigitalCaseWorker = 'a@b.com'
      stubDeclaration.returns()
      stubSubmitClaim.resolves()
      stubGetIsAdvanceClaim.resolves()
      stubCheckStatusForFinishingClaim.resolves(true)

      return supertest(app)
        .post(`${ROUTE}?paymentMethod=${paymentMethods.DIRECT_BANK_PAYMENT.value}`)
        .send(VALID_DATA)
        .set('Cookie', [`apvs-assisted-digital=${assistedDigitalCaseWorker}`])
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubCheckStatusForFinishingClaim, REFERENCE, ELIGIBILITYID, CLAIMID)
          sinon.assert.calledWith(stubSubmitClaim, REFERENCE, ELIGIBILITYID, CLAIMID, CLAIM_TYPE, assistedDigitalCaseWorker, paymentMethods.DIRECT_BANK_PAYMENT.value)
        })
    })

    it('should just go to redirect if checkStatusForFinishingClaim returns false in case of double submission', function () {
      stubDeclaration.returns()
      stubGetIsAdvanceClaim.resolves()
      stubCheckStatusForFinishingClaim.resolves(false)

      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubCheckStatusForFinishingClaim, REFERENCE, ELIGIBILITYID, CLAIMID)
          sinon.assert.notCalled(stubSubmitClaim)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      stubDeclaration.throws(new ValidationError({ 'firstName': {} }))
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects on submitting claim.', function () {
      stubDeclaration.returns()
      stubSubmitClaim.rejects()
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
