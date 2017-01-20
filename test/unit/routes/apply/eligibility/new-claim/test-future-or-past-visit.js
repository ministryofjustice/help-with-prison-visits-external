const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const expect = require('chai').expect
const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/new-claim/future-or-past-visit', function () {
  const REFERENCEID = 'FUTPAST-1234'
  const ROUTE = `/apply/first-time/eligibility/${REFERENCEID}/new-claim`
  const REPEAT_ROUTE = `/apply/repeat/eligibility/${REFERENCEID}/new-claim`
  var app
  var urlValidatorCalled = false
  var futureOrPastVisitStub

  beforeEach(function () {
    futureOrPastVisitStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/new-claim/future-or-past-visit', {
      '../../../../services/validators/url-path-validator': function () { urlValidatorCalled = true },
      '../../../../services/domain/future-or-past-visit': futureOrPastVisitStub
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
      futureOrPastVisitStub.returns({ advancePast: 'past' })
      return supertest(app)
        .post(ROUTE)
        .send({'advance-past': 'past'})
        .expect(302)
        .expect('location', `${ROUTE}/past`)
    })

    it('should redirect to /apply/first-time/eligibility/:reference/new-claim/same-journey-as-last-claim/advance for repeat claim', function () {
      futureOrPastVisitStub.returns({ advancePast: 'advance' })
      return supertest(app)
        .post(REPEAT_ROUTE)
        .send({'advance-past': 'advance'})
        .expect(302)
        .expect('location', `${REPEAT_ROUTE}/same-journey-as-last-claim/advance`)
    })

    it('should respond with a 400 if domain object validation fails', function () {
      futureOrPastVisitStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs', function () {
      futureOrPastVisitStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
