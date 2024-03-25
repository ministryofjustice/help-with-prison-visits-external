const routeHelper = require('../../../helpers/routes/route-helper')
const ValidationError = require('../../../../app/services/errors/validation-error')
const supertest = require('supertest')
const sinon = require('sinon')

jest.mock('../../services/validators/url-path-validator', () => urlPathValidatorStub);

jest.mock(
  '../../services/domain/updated-contact-details',
  () => updatedContactDetailsStub
);

jest.mock(
  '../../services/data/insert-eligibility-visitor-updated-contact-detail',
  () => insertEligibilityVisitorUpdatedContactDetailStub
);

describe('/your-claims/update-contact-details', function () {
  const COOKIES = ['apvs-start-application=eyJub3dJbk1pbnV0ZXMiOjI0OTA4MjM3LjI5MDYxNjY2NSwiZGVjcnlwdGVkUmVmIjoiUUhRQ1hXWiIsImRvYkVuY29kZWQiOiIxMTQwMTc2MDciLCJwcmlzb25lck51bWJlciI6IkExMjM0QkMiLCJlbGlnaWJpbGl0eUlkIjoxfQ==']
  const ROUTE = '/your-claims/update-contact-details'

  let app
  let urlPathValidatorStub
  let updatedContactDetailsStub
  let insertEligibilityVisitorUpdatedContactDetailStub

  beforeEach(function () {
    urlPathValidatorStub = sinon.stub()
    updatedContactDetailsStub = sinon.stub()
    insertEligibilityVisitorUpdatedContactDetailStub = sinon.stub()

    const route = require('../../../../app/routes/your-claims/update-contact-details')
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .set('Cookie', COOKIES)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should call the URL Path Validator', function () {
      updatedContactDetailsStub.returns({})
      insertEligibilityVisitorUpdatedContactDetailStub.resolves({})
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        });
    })

    it('should respond with a 302 and redirect to /your-claims/check-your-information', function () {
      updatedContactDetailsStub.returns({})
      insertEligibilityVisitorUpdatedContactDetailStub.resolves({})

      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .send({ 'email-address': 'test@test.com', 'phone-number': '5553425172' })
        .expect(302)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect('location', '/your-claims/check-your-information');
    })

    it('should respond with a 400 for a validation error', function () {
      updatedContactDetailsStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(400)
    })

    it('should respond with a 500 for a non-validation error', function () {
      updatedContactDetailsStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })

    it('should respond with a 500 if promise rejects.', function () {
      insertEligibilityVisitorUpdatedContactDetailStub.rejects()
      return supertest(app)
        .post(ROUTE)
        .set('Cookie', COOKIES)
        .expect(500)
    })
  })
})
