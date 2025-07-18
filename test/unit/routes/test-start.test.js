const supertest = require('supertest')
const routeHelper = require('../../helpers/routes/route-helper')

const claimTypeEnum = require('../../../app/constants/claim-type-enum')

const route = require('../../../app/routes/start')

describe('routes/start', () => {
  const ROUTE = '/start'

  let app

  beforeEach(() => {
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ROUTE}`, () => {
    it('should respond with a 200', () => {
      return supertest(app).get(ROUTE).expect(200)
    })
  })

  describe(`POST ${ROUTE}`, () => {
    it('should respond with 400 if madeClaimForPrisonerBefore not sent', () => {
      return supertest(app).post(ROUTE).send({}).expect(400)
    })

    it('should redirect to first time if not made Claim for prisoner before', () => {
      return supertest(app)
        .post(ROUTE)
        .send({
          madeClaimForPrisonerBefore: 'no',
        })
        .expect(302)
        .expect('location', `/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/date-of-birth`)
    })

    it('should redirect to already registered if made Claim for prisoner before', () => {
      return supertest(app)
        .post(ROUTE)
        .send({ madeClaimForPrisonerBefore: 'yes' })
        .expect(302)
        .expect('location', '/start-already-registered')
    })
  })
})
