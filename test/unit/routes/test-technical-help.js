const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const TaskEnums = require('../../../app/constants/tasks-enum')
require('sinon-bluebird')

const ValidationError = require('../../../app/services/errors/validation-error')

describe('routes/technical-help', function () {
  const ROUTE = `/technical-help`
  const VALID_DATA = {
    name: 'Joe Bloggs',
    PhoneNumber: '02874628481',
    issue: 'Testing problems are occuring'
  }

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
          sinon.assert.calledWith(technicalHelpStub, VALID_DATA.name, VALID_DATA.PhoneNumber, VALID_DATA.issue)
          sinon.assert.calledWith(insertTaskStub, null, null, null, TaskEnums.TECHNICAL_HELP_SUBMITTED, `${VALID_DATA.name}~~${VALID_DATA.PhoneNumber}~~${VALID_DATA.issue}`)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      technicalHelpStub.throws(new ValidationError({ 'name': {} }))
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })
  })
})
