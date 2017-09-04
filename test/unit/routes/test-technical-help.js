const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const TaskEnums = require('../../../app/constants/tasks-enum')
require('sinon-bluebird')

const ValidationError = require('../../../app/services/errors/validation-error')

describe('routes/help', function () {
  const ROUTE = `/help`
  const VALID_DATA = {
    name: 'Joe Bloggs',
    emailAddress: 'test@test.com',
    referenceNumber: '',
    'date-of-claim-day': '',
    'date-of-claim-month': '',
    'date-of-claim-year': '',
    issue: 'Testing problems are occuring'
  }

  var dateOfClaim
  var app

  var technicalHelpStub
  var insertTaskStub

  beforeEach(function () {
    technicalHelpStub = sinon.stub()
    insertTaskStub = sinon.stub().resolves()

    var route = proxyquire('../../../app/routes/technical-help', {
      '../services/domain/technical-help': technicalHelpStub,
      '../services/data/insert-task': insertTaskStub
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
          sinon.assert.calledWith(insertTaskStub, null, null, null, TaskEnums.TECHNICAL_HELP_SUBMITTED, `${VALID_DATA.name}~~${VALID_DATA.emailAddress}~~Reference number: ${VALID_DATA.referenceNumber}\n\nDate of Claim: \n\n${VALID_DATA.issue}`)
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
