const routeHelper = require('../../../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')
const ValidationError = require('../../../../../app/services/errors/validation-error')

let urlPathValidatorStub
let stubInsertVisitor
let stubDuplicateClaimCheck
let stubGetTravellingFromAndTo
let stubAboutYou
let app

jest.mock('../../../services/data/insert-visitor', () => stubInsertVisitor)

jest.mock(
  '../../../services/data/duplicate-claim-check',
  () => stubDuplicateClaimCheck
)

jest.mock(
  '../../../services/data/get-travelling-from-and-to',
  () => stubGetTravellingFromAndTo
)

jest.mock('../../../services/domain/about-you', () => stubAboutYou)

jest.mock(
  '../../../services/validators/url-path-validator',
  () => urlPathValidatorStub
)

describe('routes/apply/new-eligibility/about-you', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI1OTQ4MDkwLjYyODkxNjY2NiwiZG9iRW5jb2RlZCI6IjExNDAxNzYwNyIsInJlbGF0aW9uc2hpcCI6InI0IiwiYmVuZWZpdCI6ImIxIiwiYmVuZWZpdE93bmVyIjoieWVzIiwicmVmZXJlbmNlSWQiOiI0ZTMzMDkxZmJkY2YzZmE3MGFhYjhhYjUiLCJkZWNyeXB0ZWRSZWYiOiJERU5RQTk2IiwiY2xhaW1UeXBlIjoiZmlyc3QtdGltZSJ9']
  const COOKIES_EXPIRED = ['apvs-start-application=']
  const ROUTE = '/apply/first-time/new-eligibility/about-you'

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    stubInsertVisitor = sinon.stub()
    stubDuplicateClaimCheck = sinon.stub()
    stubGetTravellingFromAndTo = sinon.stub()
    stubAboutYou = sinon.stub()

    const route = require('../../../../../app/routes/apply/new-eligibility/about-you')

    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200 for valid path parameters', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should persist data and redirect to /apply/eligibility/new-claim/future-or-past-visit for valid data', function () {
      stubDuplicateClaimCheck.resolves(false)
      stubInsertVisitor.resolves()
      stubGetTravellingFromAndTo.resolves({ to: 'hewell' })
      stubAboutYou.returns({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/eligibility/new-claim/future-or-past-visit')
    })

    it('should persist data and redirect to /apply/first-time/new-eligibility/date-of-birth?error=expired', function () {
      stubDuplicateClaimCheck.resolves(false)
      stubInsertVisitor.resolves()
      stubGetTravellingFromAndTo.resolves({ to: 'hewell' })
      stubAboutYou.returns({})

      return supertest(app)
        .post(ROUTE)
        .expect(302)
        .set('Cookie', COOKIES_EXPIRED)
        .expect('location', '/apply/first-time/new-eligibility/date-of-birth?error=expired')
    })

    it('should not do duplicate check for Northern Ireland person', function () {
      stubAboutYou.returns({
        country: 'Northern Ireland',
        postCode: 'BT12 2WW'
      })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
          sinon.assert.notCalled(stubDuplicateClaimCheck)
          sinon.assert.notCalled(stubInsertVisitor)
          sinon.assert.notCalled(stubGetTravellingFromAndTo)
        })
    })

    it('should respond with a 400 for invalid data', function () {
      stubAboutYou.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 400 for a duplicate claim', function () {
      stubDuplicateClaimCheck.resolves(true)
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      stubAboutYou.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      stubInsertVisitor.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
