const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const expect = require('chai').expect

describe('routes/apply/eligibility/new-claim/future-or-past-visit', function () {
  const REFERENCEID = 'FUTPAST-1234'
  const ROUTE = `/apply/first-time/eligibility/${REFERENCEID}/new-claim`
  const REPEAT_ROUTE = `/apply/repeat/eligibility/${REFERENCEID}/new-claim`
  var app
  var urlValidatorCalled = false

  beforeEach(function () {
    var route = proxyquire('../../../../../../app/routes/apply/eligibility/new-claim/future-or-past-visit', {
      '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true }
    })
    app = routeHelper.buildApp(route)
    urlValidatorCalled = false
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
        .expect(function () {
          expect(urlValidatorCalled).to.be.true
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should redirect to /apply/first-time/eligibility/:reference/new-claim/past for first-time claim', function () {
      return supertest(app)
        .post(ROUTE)
        .send({'advance-past': 'past'})
        .expect(302)
        .expect('location', `${ROUTE}/past`)
    })

    it('should redirect to /apply/first-time/eligibility/:reference/new-claim/same-journey-as-last-claim/advance for repeat claim', function () {
      return supertest(app)
        .post(REPEAT_ROUTE)
        .send({'advance-past': 'advance'})
        .expect(302)
        .expect('location', `${REPEAT_ROUTE}/same-journey-as-last-claim/advance`)
    })
  })
})
