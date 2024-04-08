const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')

const claimTypeEnum = require('../../../app/constants/claim-type-enum')

const route = require('../../../app/routes/start')

describe('routes/start', function () {
  const ROUTE = '/start'

  let app

  beforeEach(function () {
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should respond with 400 if madeClaimForPrisonerBefore not sent', function () {
      return supertest(app)
        .post(ROUTE)
        .send({})
        .expect(400)
    })

    it('should redirect to first time if not made Claim for prisoner before', function () {
      return supertest(app)
        .post(ROUTE)
        .send({
          madeClaimForPrisonerBefore: 'no'
        })
        .expect(302)
        .expect('location', `/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/date-of-birth`)
    })

    it('should redirect to already registered if made Claim for prisoner before', function () {
      return supertest(app)
        .post(ROUTE)
        .send({ madeClaimForPrisonerBefore: 'yes' })
        .expect(302)
        .expect('location', '/start-already-registered')
    })
  })
})
