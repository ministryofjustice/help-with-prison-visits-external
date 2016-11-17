const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/new-claim/journey-information', function () {
  const REFERENCE = 'JOURNEY'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const CLAIM_ID = '123'
  const ROUTE = `/apply/first-time/eligibility/${REFERENCEID}/new-claim/past`

  var app

  var urlPathValidatorStub
  var firstTimeClaimStub
  var insertFirstTimeClaimStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    firstTimeClaimStub = sinon.stub()
    insertFirstTimeClaimStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/new-claim/journey-information', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/domain/first-time-claim': firstTimeClaimStub,
      '../../../../services/data/insert-first-time-claim': insertFirstTimeClaimStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const FIRST_TIME_CLAIM = {}

    it('should call the URL Path Validator', function () {
      insertFirstTimeClaimStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should insert valid FirstTimeClaim domain object', function () {
      firstTimeClaimStub.returns(FIRST_TIME_CLAIM)
      insertFirstTimeClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(firstTimeClaimStub)
          sinon.assert.calledOnce(insertFirstTimeClaimStub)
          sinon.assert.calledWith(insertFirstTimeClaimStub, REFERENCE, ELIGIBILITYID, FIRST_TIME_CLAIM)
        })
        .expect(302)
    })

    it('should redirect to expenses page if child-visitor is set to no', function () {
      insertFirstTimeClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .expect('location', `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIM_ID}`)
    })

    it('should redirect to about-child page if child-visitor is set to yes', function () {
      insertFirstTimeClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .send({
          'child-visitor': 'yes'
        })
        .expect('location', `/apply/first-time/eligibility/${REFERENCEID}/claim/${CLAIM_ID}/child`)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      insertFirstTimeClaimStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      insertFirstTimeClaimStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
