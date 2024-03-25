const routeHelper = require('../../../helpers/routes/route-helper')
const ValidationError = require('../../../../app/services/errors/validation-error')
const supertest = require('supertest')
const sinon = require('sinon')

jest.mock('../../services/validators/url-path-validator', () => urlPathValidatorStub)
jest.mock('../../services/helpers/decrypt', () => decryptStub)
jest.mock('../../services/data/get-repeat-eligibility', () => getRepeatEligibility)
jest.mock('../../services/domain/check-your-information', () => CheckYourInformation)

describe('/your-claims/check-your-information', function () {
  const REFERENCE = 'APVS123'
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MTgzLjA0MjMzMzMzNSwiZGVjcnlwdGVkUmVmIjoiUUhRQ1hXWiIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QkMifQ==']
  const ROUTE = '/your-claims/check-your-information'

  let app

  let urlPathValidatorStub
  let decryptStub
  let getRepeatEligibility
  let CheckYourInformation

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    decryptStub = sinon.stub().returns(REFERENCE)
    getRepeatEligibility = sinon.stub()
    CheckYourInformation = sinon.stub()

    const route = require('../../../../app/routes/your-claims/check-your-information')
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

    it('should call to get masked eligibility and respond with a 200', function () {
      getRepeatEligibility.resolves({})
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if promise rejects.', function () {
      getRepeatEligibility.rejects()
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 302 and redirect to /apply/eligibility/new-claim/future-or-past-visit', function () {
      CheckYourInformation.returns({})
      getRepeatEligibility.resolves({ NameOfPrison: 'hewell', Country: 'England' })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/eligibility/new-claim/future-or-past-visit')
    })

    it('should respond with a 302 and redirect to /apply/eligibility/new-claim/future-or-past-visit if prison GB and Country NI', function () {
      CheckYourInformation.returns({})
      getRepeatEligibility.resolves({ NameOfPrison: 'hewell', Country: 'Northern Ireland' })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/eligibility/new-claim/future-or-past-visit')
    })

    it('should redirect to /apply/eligibility/new-claim/same-journey-as-last-claim for Northern Ireland prison and Country', function () {
      CheckYourInformation.returns({})
      getRepeatEligibility.resolves({ NameOfPrison: 'maghaberry', Country: 'Northern Ireland' })

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', '/apply/eligibility/new-claim/same-journey-as-last-claim')
    })

    it('should respond with a 400 for a validation error', function () {
      CheckYourInformation.throws(new ValidationError())
      getRepeatEligibility.resolves({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
    })

    it('should respond with a 500 if promise rejects.', function () {
      CheckYourInformation.throws(new ValidationError())
      getRepeatEligibility.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 for a non-validation error', function () {
      CheckYourInformation.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      getRepeatEligibility.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
