const supertest = require('supertest')
const routeHelper = require('../../../../helpers/routes/route-helper')

const ValidationError = require('../../../../../app/services/errors/validation-error')
const prisonerRelationshipEnum = require('../../../../../app/constants/prisoner-relationships-enum')

describe('routes/apply/new-eligibility/prisoner-relationship', () => {
  const COOKIES = [
    'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTAwMjc0Ljc0NjYzMzMzMiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImRvYkVuY29kZWQiOiIxMTM3MjUxMjIifQ==',
  ]
  const COOKIES_REPEAT = [
    'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MTM3LjcxOTk2NjY2NSwiZGVjcnlwdGVkUmVmIjoiVEtZQ0NSQSIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QlEifQ==',
  ]
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/prisoner-relationship'

  let app

  const mockUrlPathValidator = jest.fn()
  const mockPrisonerRelationship = jest.fn()

  beforeEach(() => {
    jest.mock('../../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)
    jest.mock('../../../../../app/services/domain/prisoner-relationship', () => mockPrisonerRelationship)

    const route = require('../../../../../app/routes/apply/new-eligibility/prisoner-relationship')
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, () => {
    it('should call the URL Path Validator', () => {
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
    const VALID_RELATIONSHIP = prisonerRelationshipEnum.PARTNER.urlValue
    const INVALID_RELATIONSHIP = 'r14'
    const VALID_PRISONER_RELATIONSHIP = {
      relationship: VALID_RELATIONSHIP,
    }
    const INVALID_PRISONER_RELATIONSHIP = {
      relationship: INVALID_RELATIONSHIP,
    }

    it('should call the URL Path Validator', () => {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 and redirect to benefits page if the relationship value is valid', () => {
      mockPrisonerRelationship.mockReturnValue(VALID_PRISONER_RELATIONSHIP)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/benefits')
    })

    it('should respond with a 302 and redirect to /apply/first-time/new-eligibility?error=expired', () => {
      mockPrisonerRelationship.mockReturnValue(VALID_PRISONER_RELATIONSHIP)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should respond with a 302 and redirect to benefits page with reference/prisoner-number query params if repeat-new-eligibility', () => {
      const REPEAT_NEW_ELIGIBILITY_ROUTE = '/apply/repeat-new-eligibility/new-eligibility/prisoner-relationship'

      mockPrisonerRelationship.mockReturnValue(VALID_PRISONER_RELATIONSHIP)

      return supertest(app)
        .post(REPEAT_NEW_ELIGIBILITY_ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .expect(302)
        .expect('location', '/apply/repeat-new-eligibility/new-eligibility/benefits')
    })

    it('should respond with a 302 and redirect to /eligibility-fail if the relationship is set to none', () => {
      mockPrisonerRelationship.mockReturnValue(INVALID_PRISONER_RELATIONSHIP)
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(302).expect('location', '/eligibility-fail')
    })

    it('should respond with a 302 if domain object is built and then persisted successfully', () => {
      mockPrisonerRelationship.mockReturnValue(VALID_PRISONER_RELATIONSHIP)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(() => {
          expect(mockPrisonerRelationship).toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should respond with a 400 if domain object validation fails', () => {
      mockPrisonerRelationship.mockImplementation(() => {
        throw new ValidationError()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(400)
    })

    it('should respond with a 500 if a non-validation error is thrown', () => {
      mockPrisonerRelationship.mockImplementation(() => {
        throw new Error()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })
})
