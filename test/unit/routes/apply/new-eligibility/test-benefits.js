const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')

const ValidationError = require('../../../../../app/services/errors/validation-error')
const benefitsEnum = require('../../../../../app/constants/benefits-enum')

describe('routes/apply/new-eligibility/benefits', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTAxMDE5LjU4NzAxNjY3LCJjbGFpbVR5cGUiOiJmaXJzdC10aW1lIiwiZG9iRW5jb2RlZCI6IjExMzcyNTEyMiIsInJlbGF0aW9uc2hpcCI6InI1In0=']
  const COOKIES_REPEAT = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MTQxLjMxMTA2NjY3LCJkZWNyeXB0ZWRSZWYiOiJUS1lDQ1JBIiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInByaXNvbmVyTnVtYmVyIjoiQTEyMzRCUSIsInJlbGF0aW9uc2hpcCI6InIxIn0=']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/benefits'

  let app

  const mockUrlPathValidator = jest.fn()
  const mockBenefits = jest.fn()

  beforeEach(function () {
    jest.mock(
      '../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )
    jest.mock('../../../../../app/services/domain/benefits', () => mockBenefits)

    const route = require('../../../../../app/routes/apply/new-eligibility/benefits')
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
    const VALID_BENEFIT = benefitsEnum.INCOME_SUPPORT.urlValue
    const INVALID_BENEFIT = 'none'
    const VALID_PRISONER_BENEFIT = {
      benefit: VALID_BENEFIT
    }
    const INVALID_PRISONER_BENEFIT = {
      benefit: INVALID_BENEFIT
    }

    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 and redirect to prisoner page if the relationship value is valid', function () {
      mockBenefits.mockReturnValue(VALID_PRISONER_BENEFIT)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/about-the-prisoner')
    })

    it('should respond with a 302 and redirect to /apply/first-time/new-eligibility/date-of-birth?error=expired', function () {
      mockBenefits.mockReturnValue(VALID_PRISONER_BENEFIT)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should respond with a 302 and redirect to prisoner page with reference/prisoner-number query params if repeat-new-eligibility', function () {
      const REPEAT_NEW_ELIGIBILITY_ROUTE = '/apply/repeat-new-eligibility/new-eligibility/benefits'

      mockBenefits.mockReturnValue(VALID_PRISONER_BENEFIT)

      return supertest(app)
        .post(REPEAT_NEW_ELIGIBILITY_ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(302)
        .expect('location', '/apply/repeat-new-eligibility/new-eligibility/about-the-prisoner')
    })

    it('should respond with a 302 and redirect to /eligibility-fail if the benefit is set to none', function () {
      mockBenefits.mockReturnValue(INVALID_PRISONER_BENEFIT)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', '/eligibility-fail')
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', function () {
      mockBenefits.mockReturnValue(VALID_PRISONER_BENEFIT)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          expect(mockBenefits).toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should respond with a 400 if domain object validation fails', function () {
      mockBenefits.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if a non-validation error is thrown', function () {
      mockBenefits.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
