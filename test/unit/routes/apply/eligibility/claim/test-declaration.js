const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const paymentMethods = require('../../../../../../app/constants/payment-method-enum')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/claim/declaration', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3NDEwLjgzMzM2NjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1ZTI2NzIxOGFhY2UzMGE3MDciLCJkZWNyeXB0ZWRSZWYiOiJUUDVWVjg5IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1JZCI6MTF9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/eligibility/claim/declaration'
  const VALID_DATA = {
    'terms-and-conditions-input': 'yes'
  }

  let app

  let stubDeclaration
  let stubSubmitClaim
  let stubUrlPathValidator
  let stubGetIsAdvanceClaim
  let stubCheckStatusForFinishingClaim
  let stubCheckIfReferenceIsDisabled

  beforeEach(function () {
    stubDeclaration = sinon.stub()
    stubSubmitClaim = sinon.stub()
    stubUrlPathValidator = sinon.stub()
    stubGetIsAdvanceClaim = sinon.stub()
    stubCheckStatusForFinishingClaim = sinon.stub()
    stubCheckIfReferenceIsDisabled = sinon.stub()

    const route = proxyquire(
      '../../../../../../app/routes/apply/eligibility/claim/declaration', {
        '../../../../services/domain/declaration': stubDeclaration,
        '../../../../services/data/submit-claim': stubSubmitClaim,
        '../../../../services/validators/url-path-validator': stubUrlPathValidator,
        '../../../../services/data/get-is-advance-claim': stubGetIsAdvanceClaim,
        '../../../../services/data/check-status-for-finishing-claim': stubCheckStatusForFinishingClaim,
        '../../../../services/data/check-if-reference-is-disabled': stubCheckIfReferenceIsDisabled
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

    it('should respond with a 302 and call submit claim and put past in route', function () {
      stubDeclaration.returns()
      stubSubmitClaim.resolves()
      stubGetIsAdvanceClaim.resolves(false)
      stubCheckStatusForFinishingClaim.resolves(true)
      stubCheckIfReferenceIsDisabled.resolves(false)

      return supertest(app)
        .post(`${ROUTE}?paymentMethod=${paymentMethods.DIRECT_BANK_PAYMENT.value}`)
        .set('Cookie', COOKIES)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(stubDeclaration, VALID_DATA['terms-and-conditions-input'])
        })
        .expect('location', '/application-submitted')
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should use assisted digital cookie value', function () {
      const assistedDigitalCaseWorker = 'a@b.com'
      stubDeclaration.returns()
      stubSubmitClaim.resolves()
      stubGetIsAdvanceClaim.resolves()
      stubCheckStatusForFinishingClaim.resolves(true)
      stubCheckIfReferenceIsDisabled.resolves(false)

      return supertest(app)
        .post(`${ROUTE}?paymentMethod=${paymentMethods.DIRECT_BANK_PAYMENT.value}`)
        .set('Cookie', COOKIES)
        .send(VALID_DATA)
        .set('Cookie', [`apvs-assisted-digital=${assistedDigitalCaseWorker}`])
        .expect(302)
    })

    it('should just go to redirect if checkStatusForFinishingClaim returns false in case of double submission', function () {
      stubDeclaration.returns()
      stubGetIsAdvanceClaim.resolves()
      stubCheckStatusForFinishingClaim.resolves(false)
      stubCheckIfReferenceIsDisabled.resolves(false)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.notCalled(stubSubmitClaim)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      stubDeclaration.throws(new ValidationError({ firstName: {} }))
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects on submitting claim.', function () {
      stubDeclaration.returns()
      stubSubmitClaim.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
