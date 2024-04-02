const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
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

  const mockDeclaration = jest.fn()
  const mockSubmitClaim = jest.fn()
  const mockUrlPathValidator = jest.fn()
  const mockGetIsAdvanceClaim = jest.fn()
  const mockCheckStatusForFinishingClaim = jest.fn()
  const mockCheckIfReferenceIsDisabled = jest.fn()

  beforeEach(function () {
    jest.mock('../../../../../../app/services/domain/declaration', () => mockDeclaration)
    jest.mock('../../../../../../app/services/data/submit-claim', () => mockSubmitClaim)
    jest.mock(
      '../../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock(
      '../../../../../../app/services/data/get-is-advance-claim',
      () => mockGetIsAdvanceClaim
    )
    jest.mock(
      '../../../../../../app/services/data/check-status-for-finishing-claim',
      () => mockCheckStatusForFinishingClaim
    )
    jest.mock(
      '../../../../../../app/services/data/check-if-reference-is-disabled',
      () => mockCheckIfReferenceIsDisabled
    )

    const route = require('../../../../../../app/routes/apply/eligibility/claim/declaration')
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
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 and call submit claim and put past in route', function () {
      mockDeclaration.mockReturnValue()
      mockSubmitClaim.mockResolvedValue()
      mockGetIsAdvanceClaim.mockResolvedValue(false)
      mockCheckStatusForFinishingClaim.mockResolvedValue(true)
      mockCheckIfReferenceIsDisabled.mockResolvedValue(false)

      return supertest(app)
        .post(`${ROUTE}?paymentMethod=${paymentMethods.DIRECT_BANK_PAYMENT.value}`)
        .set('Cookie', COOKIES)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          expect(mockDeclaration).toHaveBeenCalledWith(VALID_DATA['terms-and-conditions-input'])
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
      mockDeclaration.mockReturnValue()
      mockSubmitClaim.mockResolvedValue()
      mockGetIsAdvanceClaim.mockResolvedValue()
      mockCheckStatusForFinishingClaim.mockResolvedValue(true)
      mockCheckIfReferenceIsDisabled.mockResolvedValue(false)

      return supertest(app)
        .post(`${ROUTE}?paymentMethod=${paymentMethods.DIRECT_BANK_PAYMENT.value}`)
        .set('Cookie', COOKIES)
        .send(VALID_DATA)
        .set('Cookie', [`apvs-assisted-digital=${assistedDigitalCaseWorker}`])
        .expect(302)
    })

    it('should just go to redirect if checkStatusForFinishingClaim returns false in case of double submission', function () {
      mockDeclaration.mockReturnValue()
      mockGetIsAdvanceClaim.mockResolvedValue()
      mockCheckStatusForFinishingClaim.mockResolvedValue(false)
      mockCheckIfReferenceIsDisabled.mockResolvedValue(false)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          expect(mockSubmitClaim).not.toHaveBeenCalled()
        })
    })

    it('should respond with a 400 if validation fails', function () {
      mockDeclaration.mockImplementation(() => { throw new ValidationError({ firstName: {} }) })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if promise rejects on submitting claim.', function () {
      mockDeclaration.mockReturnValue()
      mockSubmitClaim.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
