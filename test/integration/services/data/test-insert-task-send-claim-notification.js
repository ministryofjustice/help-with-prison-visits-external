const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const tasksEnum = require('../../../../app/constants/tasks-enum')
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const visitorHelper = require('../../../helpers/data/visitor-helper')
require('sinon-bluebird')

const MASKED_ELIGIBILITY = {EmailAddress: 'test@test.com'}
const stubGetMaskedEligibility = sinon.stub()
const stubInsertTask = sinon.stub().resolves()

const insertTaskSendClaimNotification = proxyquire('../../../../app/services/data/insert-task-send-claim-notification', {
  './insert-task': stubInsertTask,
  './get-masked-eligibility': stubGetMaskedEligibility
})

const reference = 'S123456'
var eligibilityId
var claimId = 123

describe('services/data/insert-task-send-claim-notification', function () {
  describe('called for existing Eligibility data', function () {
    before(function () {
      return eligiblityHelper.insertEligibilityVisitorAndPrisoner(reference)
        .then(function (newEligibilityId) {
          eligibilityId = newEligibilityId
        })
    })

    it('should insert a new task to send the first time claim notification', function () {
      return insertTaskSendClaimNotification(reference, eligibilityId, claimId)
        .then(function () {
          expect(stubInsertTask.calledWith(reference, eligibilityId, claimId, tasksEnum.SEND_CLAIM_NOTIFICATION, visitorHelper.EMAIL_ADDRESS))
        })
    })

    after(function () {
      return eligiblityHelper.deleteAll(reference)
    })
  })

  describe('called for repeat claim with no Eligibility data in External Schema', function () {
    it('should call to get Masked Eligibility and insert a new task to send the claim notification', function () {
      stubGetMaskedEligibility.resolves(MASKED_ELIGIBILITY)
      return insertTaskSendClaimNotification(reference, eligibilityId, claimId)
        .then(function () {
          expect(stubGetMaskedEligibility.calledOnce).to.be.true
          expect(stubInsertTask.calledWith(reference, eligibilityId, claimId, tasksEnum.SEND_CLAIM_NOTIFICATION, MASKED_ELIGIBILITY.EmailAddress))
        })
    })
  })

  describe('called for claim with no contact data', function () {
    it('should throw an error', function () {
      stubGetMaskedEligibility.resolves()
      return insertTaskSendClaimNotification(reference, eligibilityId, claimId)
        .then(function () {
          expect(false, 'should have thrown an error').to.be.true
        })
        .catch(function (error) {
          expect(error, 'should have thrown an error').not.to.be.null
        })
    })
  })
})
