const routeHelper = require('../../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')

jest.mock('../../services/validators/url-path-validator', () => urlPathValidatorStub)
jest.mock('../../services/data/get-historic-claims', () => getHistoricClaimsStub)

jest.mock(
  '../../services/data/get-historic-claims-by-reference',
  () => getHistoricClaimsByReferenceStub
)

describe('/your-claims/your-claims', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MjU5LjQ4NjY2NjY3LCJkZWNyeXB0ZWRSZWYiOiJRSFFDWFdaIiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyJ9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/your-claims'

  const CLAIMS_CAN_START_NEW_CLAIM = [{ Status: 'APPROVED' }, { Status: 'AUTO-APPROVED' }, { Status: 'REJECTED' }]
  const CLAIMS_CANNOT_START_NEW_CLAIM = [{ Status: 'INPROGRESS' }]

  let app

  let urlPathValidatorStub
  let getHistoricClaimsStub
  let getHistoricClaimsByReferenceStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    getHistoricClaimsStub = sinon.stub()
    getHistoricClaimsByReferenceStub = sinon.stub()

    const route = require('../../../../app/routes/your-claims/your-claims')
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 200 if the database query returns a result', function () {
      getHistoricClaimsStub.resolves(CLAIMS_CAN_START_NEW_CLAIM)
      getHistoricClaimsByReferenceStub.resolves(CLAIMS_CAN_START_NEW_CLAIM)
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })

    it('should set canStartNewClaim to true if no claims in progress', function () {
      getHistoricClaimsStub.resolves(CLAIMS_CAN_START_NEW_CLAIM)
      getHistoricClaimsByReferenceStub.resolves(CLAIMS_CAN_START_NEW_CLAIM)
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function (response) {
          expect(response.text).toContain('"canStartNewClaim":true')
        })
    })

    it('should set canStartNewClaim to false if claims in progress', function () {
      getHistoricClaimsStub.resolves(CLAIMS_CANNOT_START_NEW_CLAIM)
      getHistoricClaimsByReferenceStub.resolves(CLAIMS_CANNOT_START_NEW_CLAIM)
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function (response) {
          expect(response.text).toContain('"canStartNewClaim":false')
        })
    })

    it('should respond with a 302 and redirect if passed a non-matching reference number dob combination', function () {
      getHistoricClaimsStub.resolves([])
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect('location', '/start-already-registered?error=yes')
    })

    it('should respond with a 302 and redirect if cookie is missing reference and dob', function () {
      getHistoricClaimsStub.resolves([])
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 500 if promise rejects.', function () {
      getHistoricClaimsStub.rejects()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
