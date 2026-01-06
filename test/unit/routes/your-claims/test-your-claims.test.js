const supertest = require('supertest')
const routeHelper = require('../../../helpers/routes/route-helper')

describe('/your-claims/your-claims', () => {
  const COOKIES = [
    'apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MjU5LjQ4NjY2NjY3LCJkZWNyeXB0ZWRSZWYiOiJRSFFDWFdaIiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyJ9',
  ]
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/your-claims'

  const CLAIMS_CAN_START_NEW_CLAIM = [{ Status: 'APPROVED' }, { Status: 'AUTO-APPROVED' }, { Status: 'REJECTED' }]
  const CLAIMS_CANNOT_START_NEW_CLAIM = [{ Status: 'INPROGRESS' }]

  let app
  let sessionData

  const mockUrlPathValidator = jest.fn()
  const mockGetHistoricClaims = jest.fn()
  const mockGetHistoricClaimsByReference = jest.fn()

  beforeEach(() => {
    jest.mock('../../../../app/services/validators/url-path-validator', () => mockUrlPathValidator)
    jest.mock('../../../../app/services/data/get-historic-claims', () => mockGetHistoricClaims)
    jest.mock('../../../../app/services/data/get-historic-claims-by-reference', () => mockGetHistoricClaimsByReference)

    const route = require('../../../../app/routes/your-claims/your-claims')
    sessionData = {}
    app = routeHelper.buildApp(route, sessionData)
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

    it.only('should respond with a 200 if the database query returns a result', () => {
      sessionData = {
        dobEncoded: '123',
        decryptedRef: '123',
      }
      mockGetHistoricClaims.mockResolvedValue(CLAIMS_CAN_START_NEW_CLAIM)
      mockGetHistoricClaimsByReference.mockResolvedValue(CLAIMS_CAN_START_NEW_CLAIM)
      return supertest(app).get(ROUTE).expect(200)
    })

    it('should set canStartNewClaim to true if no claims in progress', () => {
      mockGetHistoricClaims.mockResolvedValue(CLAIMS_CAN_START_NEW_CLAIM)
      mockGetHistoricClaimsByReference.mockResolvedValue(CLAIMS_CAN_START_NEW_CLAIM)
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(response => {
          expect(response.text).toContain('"canStartNewClaim":true')
        })
    })

    it('should set canStartNewClaim to false if claims in progress', () => {
      mockGetHistoricClaims.mockResolvedValue(CLAIMS_CANNOT_START_NEW_CLAIM)
      mockGetHistoricClaimsByReference.mockResolvedValue(CLAIMS_CANNOT_START_NEW_CLAIM)
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(response => {
          expect(response.text).toContain('"canStartNewClaim":false')
        })
    })

    it('should respond with a 302 and redirect if passed a non-matching reference number dob combination', () => {
      mockGetHistoricClaims.mockResolvedValue([])
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', '/start-already-registered?error=yes')
    })

    it('should respond with a 302 and redirect if cookie is missing reference and dob', () => {
      mockGetHistoricClaims.mockResolvedValue([])
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 500 if promise rejects.', () => {
      mockGetHistoricClaims.mockRejectedValue()
      return supertest(app).get(ROUTE).set('Cookie', COOKIES).expect(500)
    })
  })
})
