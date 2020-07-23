const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const TaskEnums = require('../../../app/constants/tasks-enum')

const ValidationError = require('../../../app/services/errors/validation-error')

describe('routes/reference-recovery', function () {
  const ROUTE = '/reference-recovery'
  const VALID_DATA = {
    EmailAddress: 'test@test.com',
    PrisonerNumber: 'B7328973'
  }

  var app

  var referenceRecoveryStub
  var insertTaskStub

  beforeEach(function () {
    referenceRecoveryStub = sinon.stub()
    insertTaskStub = sinon.stub().resolves()

    var route = proxyquire('../../../app/routes/reference-recovery', {
      '../services/domain/reference-recovery': referenceRecoveryStub,
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
      referenceRecoveryStub.returns(VALID_DATA)
      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(referenceRecoveryStub, VALID_DATA.EmailAddress, VALID_DATA.PrisonerNumber)
          sinon.assert.calledWith(insertTaskStub, null, null, null, TaskEnums.REFERENCE_RECOVERY, `${VALID_DATA.EmailAddress}~~${VALID_DATA.PrisonerNumber}`)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      referenceRecoveryStub.throws(new ValidationError({ EmailAddress: {} }))
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })

    it('should respond with a 500 if any non-validation error occurs.', function () {
      referenceRecoveryStub.throws(new Error())
      return supertest(app)
        .post(ROUTE)
        .expect(500)
    })
  })
})
