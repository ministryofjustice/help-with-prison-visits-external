const supertest = require('supertest')
const routeHelper = require('../../../../helpers/routes/route-helper')
const ValidationError = require('../../../../../app/services/errors/validation-error')

const mockUrlPathValidator = jest.fn()
const mockDateOfBirth = jest.fn()
let app

describe('routes/apply/new-eligibility/date-of-birth', () => {
  const DOB = '113725122'
  const COOKIES = [
    'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTAwMjE5LjI3OTk4MzMzNCwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSJ9',
  ]
  const ROUTE = '/apply/first-time/new-eligibility/date-of-birth'

  beforeEach(() => {
    jest.mock('../../../../../app/services/domain/date-of-birth', () => mockDateOfBirth)
    jest.mock('../../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)

    const route = require('../../../../../app/routes/apply/new-eligibility/date-of-birth')

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
    describe('for over-sixteen date', () => {
      it('should call the URL Path Validator', () => {
        return supertest(app)
          .get(ROUTE)
          .set('Cookie', COOKIES)
          .expect(() => {
            expect(mockUrlPathValidator).toHaveBeenCalledTimes(1)
          })
      })

      it('should respond with a 302 and redirect to /apply/first-time/new-eligibility/prisoner-relationship', () => {
        mockDateOfBirth.mockReturnValue({ encodedDate: DOB, sixteenOrUnder: false })
        return supertest(app)
          .post(ROUTE)
          .set('Cookie', COOKIES)
          .expect(302)
          .expect(() => {
            expect(mockDateOfBirth).toHaveBeenCalledTimes(1)
          })
          .expect('location', '/apply/first-time/new-eligibility/prisoner-relationship')
          .expect(hasSetCookie)
      })

      it('should respond with a 400 for a validation error', () => {
        mockDateOfBirth.mockImplementation(() => {
          throw new ValidationError()
        })
        return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(400)
      })

      it('should respond with a 500 for a non-validation error', () => {
        mockDateOfBirth.mockImplementation(() => {
          throw new Error()
        })
        return supertest(app).post(ROUTE).set('Cookie', COOKIES).expect(500)
      })
    })
  })

  function hasSetCookie(res) {
    if (!JSON.stringify(res.header['set-cookie']).includes('apvs-start-application'))
      throw new Error('response does not contain expected cookie')
  }
})
