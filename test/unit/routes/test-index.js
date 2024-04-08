const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const route = require('../../../app/routes/index')

describe('routes/index', function () {
  const ASSISTED_DIGITAL_ROUTE = '/assisted-digital'

  let app

  beforeEach(function () {
    app = routeHelper.buildApp(route)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe(`GET ${ASSISTED_DIGITAL_ROUTE}`, function () {
    const COOKIE_NAME = 'apvs-assisted-digital'
    const CASEWORKER_EMAIL = 'a@b.com'
    const COOKIE = { caseworker: CASEWORKER_EMAIL }

    it('should set the assisted digital cookie if the query paramater is passed and respond with a 302', function () {
      return supertest(app)
        .get(ASSISTED_DIGITAL_ROUTE)
        .query(COOKIE)
        .expect(function (response) {
          expect(response.header['set-cookie'][0]).toContain(COOKIE_NAME)
        })
        .expect(302)
    })

    it('should not set the assisted digital cookie if the query paramater is not passed and respond with a 302', function () {
      return supertest(app)
        .get(ASSISTED_DIGITAL_ROUTE)
        .expect(function (response) {
          expect(response.header['set-cookie']).toBeUndefined()
        })
        .expect(302)
    })
  })
})
