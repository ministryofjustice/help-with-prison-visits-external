const routeHelper = require('../../helpers/routes/route-helper')
const supertest = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const TaskEnums = require('../../../app/constants/tasks-enum')
require('sinon-bluebird')

const ValidationError = require('../../../app/services/errors/validation-error')

describe('routes/feedback', function () {
  const ROUTE = `/feedback`
  const VALID_DATA = {
    rating: 'satisfied',
    improvements: 'This is a test message'
  }

  var app

  var feedbackStub
  var insertTaskStub

  beforeEach(function () {
    feedbackStub = sinon.stub()
    insertTaskStub = sinon.stub().resolves()

    var route = proxyquire('../../../app/routes/feedback', {
      '../services/domain/feedback': feedbackStub,
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
      feedbackStub.returns(VALID_DATA)
      return supertest(app)
        .post(ROUTE)
        .send(VALID_DATA)
        .expect(302)
        .expect(function () {
          sinon.assert.calledWith(feedbackStub, VALID_DATA.rating, VALID_DATA.improvements)
          sinon.assert.calledWith(insertTaskStub, null, null, null, TaskEnums.FEEDBACK_SUBMITTED, `${VALID_DATA.rating}~~${VALID_DATA.improvements}`)
        })
    })

    it('should respond with a 400 if validation fails', function () {
      feedbackStub.throws(new ValidationError({ 'rating': {} }))
      return supertest(app)
        .post(ROUTE)
        .expect(400)
    })
  })
})
