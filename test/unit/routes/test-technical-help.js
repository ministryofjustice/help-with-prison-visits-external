const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const ValidationError = require('../../../app/services/errors/validation-error')

describe('routes/help', function () {
  const ROUTE = '/help'
  const VALID_DATA = {
    name: 'Joe Bloggs',
    emailAddress: 'test@test.com',
    referenceNumber: '',
    'date-of-claim-day': undefined,
    'date-of-claim-month': undefined,
    'date-of-claim-year': undefined,
    issue: 'Testing problems are occuring'
  }

  let app
  let technicalHelpStub
  let configStub
  let axiosStub

  beforeEach(function () {
    technicalHelpStub = sinon.stub()
    axiosStub = {
      post: sinon.stub().resolves({
        status: 201,
        data: {
          ticket: {
            id: '123'
          }
        }
      })
    }
    configStub = {
      ZENDESK_ENABLED: 'true',
      ZENDESK_TEST_ENVIRONMENT: 'false',
      ZENDESK_API_URL: 'http://test/',
      ZENDESK_EMAIL_ADDRESS: 'nota@realem.mail',
      ZENDESK_API_KEY: '123'
    }

    const route = proxyquire('../../../app/routes/technical-help', {
      '../services/domain/technical-help': technicalHelpStub,
      '../../config': configStub,
      axios: axiosStub
    })
    app = routeHelper.buildApp(route)
  })

  describe(`GET ${ROUTE}`, function () {
    it('should respond with a 200', function () {
      return supertest(app)
        .get(ROUTE)
        .expect(200)
    })
  })

  describe(`POST ${ROUTE}`, function () {
    it('should respond with a 302', function () {
      technicalHelpStub.returns(VALID_DATA)
      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(technicalHelpStub, VALID_DATA.name, VALID_DATA.emailAddress, VALID_DATA.referenceNumber, VALID_DATA.day, VALID_DATA.month, VALID_DATA.year, VALID_DATA.issue)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      technicalHelpStub.throws(new ValidationError())
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if a non-validation error occurs.', function () {
      technicalHelpStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
