const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const encrypt = require('../../../../../../app/services/helpers/encrypt')
require('sinon-bluebird')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

describe('routes/apply/eligibility/new-claim/journey-information', function () {
  const REFERENCE = 'JOURNEY'
  const ELIGIBILITYID = '1234'
  const REFERENCEID = `${REFERENCE}-${ELIGIBILITYID}`
  const ENCRYPTED_REFERENCEID = encrypt(REFERENCEID)
  const CLAIM_ID = '123'
  const CLAIM_TYPE = 'first-time'
  const ADVANCE_OR_PAST = 'advance'
  const ROUTE = `/apply/${CLAIM_TYPE}/eligibility/${ENCRYPTED_REFERENCEID}/new-claim/${ADVANCE_OR_PAST}`
  const REPEAT_DUPLICATE_ROUTE = `/apply/repeat-duplicate/eligibility/${ENCRYPTED_REFERENCEID}/new-claim/${ADVANCE_OR_PAST}`

  var app

  var urlPathValidatorStub
  var newClaimStub
  var insertNewClaimStub
  var insertRepeatDuplicateClaimStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    newClaimStub = sinon.stub()
    insertNewClaimStub = sinon.stub()
    insertRepeatDuplicateClaimStub = sinon.stub()

    var route = proxyquire('../../../../../../app/routes/apply/eligibility/new-claim/journey-information', {
      '../../../../services/validators/url-path-validator': urlPathValidatorStub,
      '../../../../services/domain/new-claim': newClaimStub,
      '../../../../services/data/insert-new-claim': insertNewClaimStub,
      '../../../../services/data/insert-repeat-duplicate-claim': insertRepeatDuplicateClaimStub
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
    const REPEAT_DUPLICATE_CLAIM = {}

    it('should call the URL Path Validator', function () {
      insertNewClaimStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(urlPathValidatorStub)
        })
    })

    it('should insert valid NewClaim domain object', function () {
      newClaimStub.returns(FIRST_TIME_CLAIM)
      insertNewClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.assert.calledOnce(newClaimStub)
          sinon.assert.calledOnce(insertNewClaimStub)
          sinon.assert.calledWith(insertNewClaimStub, REFERENCE, ELIGIBILITYID, CLAIM_TYPE, FIRST_TIME_CLAIM)
        })
        .expect(302)
    })

    it('should redirect to has-escort page if child-visitor is set to no', function () {
      insertNewClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .expect('location', `/apply/first-time/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIM_ID}/has-escort`)
    })

    it('should redirect to claim summary page if claim is repeat duplicate', function () {
      newClaimStub.returns(REPEAT_DUPLICATE_CLAIM)
      insertRepeatDuplicateClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(REPEAT_DUPLICATE_ROUTE)
        .expect('location', `/apply/repeat-duplicate/eligibility/${ENCRYPTED_REFERENCEID}/claim/${CLAIM_ID}/summary`)
        .expect(function () {
          sinon.assert.calledWith(insertRepeatDuplicateClaimStub, REFERENCE, ELIGIBILITYID, REPEAT_DUPLICATE_CLAIM)
        })
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      insertNewClaimStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      insertNewClaimStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
