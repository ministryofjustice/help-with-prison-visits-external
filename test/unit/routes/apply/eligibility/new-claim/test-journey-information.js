const routeHelper = require('../../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')

const ValidationError = require('../../../../../../app/services/errors/validation-error')

jest.mock(
  '../../../../services/validators/url-path-validator',
  () => urlPathValidatorStub
)

jest.mock('../../../../services/domain/new-claim', () => newClaimStub)
jest.mock('../../../../services/data/insert-new-claim', () => insertNewClaimStub)

jest.mock(
  '../../../../services/data/insert-repeat-duplicate-claim',
  () => insertRepeatDuplicateClaimStub
)

jest.mock('../../../../services/data/get-release-date', () => getReleaseDateStub)

describe('routes/apply/eligibility/new-claim/journey-information', function () {
  const CLAIM_ID = '123'
  const ROUTE = '/apply/eligibility/new-claim/journey-information'

  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MjI4LjQxMjQzMzMzNCwiZG9iRW5jb2RlZCI6IjExMzcyNTEyMiIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwicmVmZXJlbmNlSWQiOiI1MjJmMWQxZWJhYzY1ZGE3MGIiLCJkZWNyeXB0ZWRSZWYiOiJYWVpQRjBUIiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSIsImFkdmFuY2VPclBhc3QiOiJwYXN0In0=']
  const COOKIES_REPEAT_DUPLICATE = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA3MjQwLjY4ODE2NjY2NywiZGVjcnlwdGVkUmVmIjoiVEtZQ0NSQSIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QlEiLCJyZWZlcmVuY2VJZCI6IjVlM2QxZTBkYmZhNDQ4YTcwYyIsImFkdmFuY2VPclBhc3QiOiJwYXN0IiwiY2xhaW1UeXBlIjoicmVwZWF0LWR1cGxpY2F0ZSJ9']
  const COOKIES_EXPIRED = ['apvs-start-application=']

  let app

  let urlPathValidatorStub
  let newClaimStub
  let insertNewClaimStub
  let insertRepeatDuplicateClaimStub
  let getReleaseDateStub

  const releaseDate = [
    {
      ReleaseDateIsSet: false,
      ReleaseDate: null
    }
  ]

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    newClaimStub = sinon.stub()
    insertNewClaimStub = sinon.stub()
    insertRepeatDuplicateClaimStub = sinon.stub()
    getReleaseDateStub = sinon.stub()

    const route = require(
      '../../../../../../app/routes/apply/eligibility/new-claim/journey-information'
    )
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

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    const FIRST_TIME_CLAIM = {}
    const REPEAT_DUPLICATE_CLAIM = {}

    it('should call the URL Path Validator', function () {
      getReleaseDateStub.resolves(releaseDate)
      insertNewClaimStub.resolves()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should insert valid NewClaim domain object', function () {
      getReleaseDateStub.resolves(releaseDate)
      newClaimStub.returns(FIRST_TIME_CLAIM)
      insertNewClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should redirect to has-escort page if child-visitor is set to no', function () {
      getReleaseDateStub.resolves(releaseDate)
      insertNewClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect('location', '/apply/eligibility/claim/has-escort')
    })

    it('should redirect to claim summary page if claim is repeat duplicate', function () {
      getReleaseDateStub.resolves(releaseDate)
      newClaimStub.returns(REPEAT_DUPLICATE_CLAIM)
      insertRepeatDuplicateClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_REPEAT_DUPLICATE)
        .expect('location', '/apply/eligibility/claim/summary')
    })

    it('should redirect to date-of-birth error page if cookie is expired', function () {
      getReleaseDateStub.resolves(releaseDate)
      insertNewClaimStub.resolves(CLAIM_ID)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES_EXPIRED)
        .expect(302)
        .expect('location', '/start-already-registered?error=expired')
    })

    it('should respond with a 500 if promise rejects.', function () {
      insertRepeatDuplicateClaimStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      getReleaseDateStub.resolves(releaseDate)
      insertNewClaimStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      insertNewClaimStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      insertNewClaimStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
