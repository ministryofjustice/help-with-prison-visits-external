const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const sinon = require('sinon')
const encrypt = require('../../../app/services/helpers/encrypt')

const ValidationError = require('../../../app/services/errors/validation-error')

jest.mock('../services/domain/already-registered', () => alreadyRegisteredStub)
jest.mock('../services/helpers/encrypt', () => encryptStub)

describe('routes/start-already-registered', function () {
  const ROUTE = '/start-already-registered'

  let app

  let alreadyRegisteredStub
  let encryptStub

  beforeEach(function () {
    alreadyRegisteredStub = sinon.stub()
    encryptStub = sinon.stub()

    const route = require('../../../app/routes/start-already-registered')
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })

    it('should respond with a 200 and an error array containing the start-already-registered error if the error query paramater was set to yes', function () {
      return supertest(app)
        .get(`${ROUTE}?error=yes`)
        .expect(200)
        .expect(hasExpectedInvalidReferenceAndDobError)
    })
  })

  function hasExpectedInvalidReferenceAndDobError (res) {
    if (!res.text.includes('start-already-registered')) throw new Error('response does not contain expected error')
  }

  describe(`POST ${ROUTE}`, function () {
    const REFERENCE = 'APVS123'
    const ENCRYPTED_REFERENCE = encrypt(REFERENCE)
    const DOB = '113725122'
    const ALREADY_REGISTERED = { dobEncoded: DOB }

    it('should respond with a 302 if domain object is built successfully', function () {
      return supertest(app)
        .post(ROUTE)
        .expect(function () {
          sinon.toHaveBeenCalledTimes(1)
        })
        .expect(302)
    })

    it('should redirect to the your-claims page with the reference and the dob set in a cookie', function () {
      alreadyRegisteredStub.returns(ALREADY_REGISTERED)
      encryptStub.returns(ENCRYPTED_REFERENCE)
      return supertest(app)
        .post(ROUTE)
        .send({
          reference: REFERENCE
        })
        .expect('location', '/your-claims')
        .expect(hasSetCookie)
    })

    it('should respond with a 400 if domain object validation fails.', function () {
      alreadyRegisteredStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      alreadyRegisteredStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })

  function hasSetCookie (res) {
    if (!JSON.stringify(res.header['set-cookie']).includes('apvs-start-application')) throw new Error('response does not contain expected cookie')
  }
})
