const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../../../app/services/helpers/encrypt')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/new-claim/same-journey-as-last-claim', function () {
  const REFERENCE = 'SAMEJO'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const ENCRYPTED_REFERENCEID = encrypt(REFERENCEID)
  const ADVANCE_OR_PAST = 'past'
  const ROUTE = `/apply/repeat/eligibility/${ENCRYPTED_REFERENCEID}/new-claim/same-journey-as-last-claim/${ADVANCE_OR_PAST}`

  var app

  var urlPathValidatorStub
  var sameJourneyAsLastClaimStub
  var getLastClaimDetailsStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    sameJourneyAsLastClaimStub = sinon.stub()
    getLastClaimDetailsStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/new-claim/same-journey-as-last-claim', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/domain/same-journey-as-last-claim': sameJourneyAsLastClaimStub,
      '../../../../services/data/get-last-claim-details': getLastClaimDetailsStub
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
      getLastClaimDetailsStub.resolves()
      return supertest(app)
        .get(ROUTE)
        .expect(200)
        .expect(function () {
          sinon.assert.calledWith(getLastClaimDetailsStub, REFERENCE, ELIGIBILITYID)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should redirect to /new-claim/past for a repeat claim if no', function () {
      sameJourneyAsLastClaimStub.returns({})
      return supertest(app)
        .post(ROUTE)
        .send({'same-journey-as-last-claim': 'no'})
        .expect('location', `/apply/repeat/eligibility/${ENCRYPTED_REFERENCEID}/new-claim/${ADVANCE_OR_PAST}`)
    })

    it('should redirect to /new-claim/past for a repeat-duplicate claim if yes', function () {
      sameJourneyAsLastClaimStub.returns({})
      return supertest(app)
        .post(ROUTE)
        .send({'same-journey-as-last-claim': 'yes'})
        .expect('location', `/apply/repeat-duplicate/eligibility/${ENCRYPTED_REFERENCEID}/new-claim/${ADVANCE_OR_PAST}`)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      sameJourneyAsLastClaimStub.throws(new ValidationError())
      getLastClaimDetailsStub.resolves({})
      return supertest(app)
        .post(ROUTE)
        .expect(400)
        .expect(function () {
          sinon.assert.calledWith(getLastClaimDetailsStub, REFERENCE, ELIGIBILITYID)
        })
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      sameJourneyAsLastClaimStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
