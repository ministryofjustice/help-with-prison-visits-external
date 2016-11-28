const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const tasksEnum = require('../../../../app/constants/tasks-enum')
const eligibilityStatusEnum = require('../../../../app/constants/eligibility-status-enum')
const claimStatusEnum = require('../../../../app/constants/claim-status-enum')
require('sinon-bluebird')

const REFERENCE = 'SUBMITF'
const CLAIM_TYPE = 'first-time'
var eligibilityId
var claimId

var stubInsertTask = sinon.stub().resolves()
var stubInsertTaskSendClaimNotification = sinon.stub().resolves()

const submitClaim = proxyquire('../../../../app/services/data/submit-claim', {
  './insert-task': stubInsertTask,
  './insert-task-send-claim-notification': stubInsertTaskSendClaimNotification
})

describe('services/data/submit-claim', function () {
  before(function () {
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  it('should update Eligibility/Claim Status, DateSubmitted and insert tasks', function () {
    var currentDate = new Date()
    var twoMinutesAgo = new Date().setMinutes(currentDate.getMinutes() - 2)
    var twoMinutesAhead = new Date().setMinutes(currentDate.getMinutes() + 2)
    var assistedDigitalCaseworker = 'a@b.com'

    submitClaim(REFERENCE, eligibilityId, claimId, CLAIM_TYPE, assistedDigitalCaseworker)
      .then(function () {
        knex.first().from('ExtSchema.Eligibility').where('Reference', REFERENCE)
          .then(function (eligibility) {
            return knex.first().from('ExtSchema.Claim').where('Reference', REFERENCE)
              .then(function (claim) {
                expect(eligibility.Status).to.equal(eligibilityStatusEnum.SUBMITTED)
                expect(eligibility.DateSubmitted).to.be.within(twoMinutesAgo, twoMinutesAhead)

                expect(claim.Status).to.equal(claimStatusEnum.SUBMITTED)
                expect(claim.AssistedDigitalCaseworker).to.equal(assistedDigitalCaseworker)
                expect(claim.DateSubmitted).to.be.within(twoMinutesAgo, twoMinutesAhead)

                expect(stubInsertTask.calledWith(REFERENCE, eligibilityId, claimId, tasksEnum.COMPLETE_CLAIM, CLAIM_TYPE)).to.be.true
                expect(stubInsertTaskSendClaimNotification.calledWith(REFERENCE, eligibilityId, claimId)).to.be.true
              })
          })
      })
  })

  it('should throw an error if no valid claim', function () {
    return submitClaim('NONE123', 4321, 123456, CLAIM_TYPE, undefined)
      .catch(function (error) {
        expect(error.message).to.contain('Could not find Claim')
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
