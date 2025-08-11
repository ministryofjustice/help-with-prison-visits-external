const supertest = require('supertest')
const routeHelper = require('../../../../../helpers/routes/route-helper')
const ValidationError = require('../../../../../../app/services/errors/validation-error')

const COOKIES = [
  'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MjU1Ljc4NzksImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJyZWxhdGlvbnNoaXAiOiJyNCIsImJlbmVmaXQiOiJiMSIsInJlZmVyZW5jZUlkIjoiNWMyZTc3MWViNmNmMzlhNzA5IiwiZGVjcnlwdGVkUmVmIjoiVlgwUEo5MCIsImNsYWltVHlwZSI6ImZpcnN0LXRpbWUifQ==',
]
const COOKIES_REPEAT = [
  'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MjgyLjA3ODMzMzMzMywiZGVjcnlwdGVkUmVmIjoiUUhRQ1hXWiIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QkMiLCJyZWZlcmVuY2VJZCI6IjViM2UxNjBkYTRhMTUzYTcwZiIsImNsYWltVHlwZSI6InJlcGVhdCJ9',
]
const COOKIES_EXPIRED = ['apvs-start-application=']

describe('routes/apply/eligibility/new-claim/future-or-past-visit', () => {
  const ROUTE = '/apply/eligibility/new-claim/future-or-past-visit'

  let app
  let urlValidatorCalled = false
  const mockFutureOrPastVisit = jest.fn()
  const mockUrlValidatorCalled = jest.fn().mockImplementation(() => {
    urlValidatorCalled = true
  })

  beforeEach(() => {
    jest.mock('../../../../../../app/services/validators/url-path-validator', () => mockUrlValidatorCalled)
    jest.mock('../../../../../../app/services/domain/future-or-past-visit', () => mockFutureOrPastVisit)

    const route = require('../../../../../../app/routes/apply/eligibility/new-claim/future-or-past-visit')
    app = routeHelper.buildApp(route)
    urlValidatorCalled = false
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, () => {
    it('should respond with a 200', () => {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(() => {
          expect(urlValidatorCalled).toBe(true)  //eslint-disable-line
        })
    })
  })

  describe(`POST ${ROUTE}`, () => {
    it('should redirect to /apply/eligibility/new-claim/journey-information for first-time claim', () => {
      mockFutureOrPastVisit.mockReturnValue({ advancePast: 'past' })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send({ 'advance-past': 'past' })
        .expect(302)
        .expect('location', '/apply/eligibility/new-claim/journey-information')
    })

    it('should redirect to date-of-birth error page if cookie is expired', () => {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should redirect to /apply/eligibility/new-claim/journey-information for repeat claim', () => {
      mockFutureOrPastVisit.mockReturnValue({ advancePast: 'advance' })
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT)
        .send({ 'advance-past': 'advance' })
        .expect(302)
        .expect('location', '/apply/eligibility/new-claim/same-journey-as-last-claim')
    })

    it('should respond with a 400 if domain object validation fails', () => {
      mockFutureOrPastVisit.mockImplementation(() => {
        throw new ValidationError()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs', () => {
      mockFutureOrPastVisit.mockImplementation(() => {
        throw new Error()
      })
      return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })
})
