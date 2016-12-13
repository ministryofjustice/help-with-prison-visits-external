var expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')
const tasksEnum = require('../../../../app/constants/tasks-enum')

const REPEAT_ELIGIBILITY = {EmailAddress: 'test@test.com'}
const REFERENCE = 'V123456'
const ELIGIBILITYID = 1
const CLAIMID = 1

describe('services/data/submit-update', function () {
  var submitUpdate
  var getRepeatEligibilityStub
  var insertTaskStub

  before(function () {
    getRepeatEligibilityStub = sinon.stub()
    insertTaskStub = sinon.stub()

    submitUpdate = proxyquire('../../../../app/services/data/submit-update', {
      './get-repeat-eligibility': getRepeatEligibilityStub,
      './insert-task': insertTaskStub
    })
  })

  it('should insert two tasks and retrieve email address', function () {
    getRepeatEligibilityStub.resolves(REPEAT_ELIGIBILITY)
    insertTaskStub.resolves()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', { required: false })
      .then(function () {
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')).to.be.true
        expect(getRepeatEligibilityStub.calledWith(REFERENCE, null, ELIGIBILITYID)).to.be.true
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE_SUBMITTED_NOTIFICATION, REPEAT_ELIGIBILITY.EmailAddress)).to.be.true
      })
  })

  it('should throw an error when no email address exists', function () {
    getRepeatEligibilityStub.resolves({})
    insertTaskStub.resolves()
    return submitUpdate(REFERENCE, ELIGIBILITYID, CLAIMID, '', { required: false })
      .then(function () {
        expect(insertTaskStub.calledWith(REFERENCE, ELIGIBILITYID, CLAIMID, tasksEnum.REQUEST_INFORMATION_RESPONSE, '')).to.be.true
      })
      .catch(function (error) {
        expect(error).to.be.equal('Could not find email address to send notification')
      })
  })
})
