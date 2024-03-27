const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const ValidationError = require('../../../../../app/services/errors/validation-error')

const mockUrlPathValidator = jest.fn()
const mockAboutThePrisoner = jest.fn()
const mockInsertNewEligibilityAndPrisoner = jest.fn()
let app

describe('routes/apply/new-eligibility/about-the-prisoner', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI1OTQ4MDg2LjY0NDMsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJyZWxhdGlvbnNoaXAiOiJyNCIsImJlbmVmaXQiOiJiMSIsImJlbmVmaXRPd25lciI6InllcyJ9']
  const COOKIES_NOT_BENEFIT_OWNER = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI1OTQ4MDk3LjE1MTI4MzMzNSwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InIxIiwiYmVuZWZpdCI6ImIxIiwiYmVuZWZpdE93bmVyIjoibm8ifQ==']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/about-the-prisoner'

  beforeEach(function () {
    jest.mock(
      '../../../../../app/services/data/insert-new-eligibility-and-prisoner',
      () => mockInsertNewEligibilityAndPrisoner
    )
    jest.mock('../../../../../app/services/domain/about-the-prisoner', () => mockAboutThePrisoner)
    jest.mock(
      '../../../../../app/services/validators/url-path-validator',
      () => mockUrlPathValidator
    )

    const route = require('../../../../../app/routes/apply/new-eligibility/about-the-prisoner')

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
  })

  describe(`POST ${ROUTE}`, function () {
    it('should persist data and redirect to first-time/about-you for valid data and benefit owner', function () {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newAboutThePrisoner = {}
      mockInsertNewEligibilityAndPrisoner.mockResolvedValue({ reference: newReference, eligibilityId: newEligibilityId })
      mockAboutThePrisoner.mockReturnValue(newAboutThePrisoner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
          expect(mockAboutThePrisoner).toHaveBeenCalledTimes(1)
          expect(mockInsertNewEligibilityAndPrisoner).hasBeenCalledWith(newAboutThePrisoner, 'first-time', undefined)
        })
        .expect('location', '/apply/first-time/new-eligibility/about-you')
    })

    it('should persist data and redirect to first-time/benefit-owner for valid data and not benefit owner', function () {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newAboutThePrisoner = {}
      mockInsertNewEligibilityAndPrisoner.mockResolvedValue({ reference: newReference, eligibilityId: newEligibilityId })
      mockAboutThePrisoner.mockReturnValue(newAboutThePrisoner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_NOT_BENEFIT_OWNER)
        .expect(302)
        .expect(function () {
          expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
          expect(mockAboutThePrisoner).toHaveBeenCalledTimes(1)
          expect(mockInsertNewEligibilityAndPrisoner).hasBeenCalledWith(newAboutThePrisoner, 'first-time', undefined)
        })
        .expect('location', '/apply/first-time/new-eligibility/benefit-owner')
    })

    it('should persist data and redirect to /apply/first-time/new-eligibility?error=expired', function () {
      const newReference = 'NEWREF1'
      const newEligibilityId = 1234
      const newAboutThePrisoner = {}
      mockInsertNewEligibilityAndPrisoner.mockResolvedValue({ reference: newReference, eligibilityId: newEligibilityId })
      mockAboutThePrisoner.mockReturnValue(newAboutThePrisoner)

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should respond with a 400 for invalid data', function () {
      mockAboutThePrisoner.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      mockAboutThePrisoner.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      mockInsertNewEligibilityAndPrisoner.mockRejectedValue()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
