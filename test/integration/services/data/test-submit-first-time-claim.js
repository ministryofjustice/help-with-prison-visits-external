const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const eligibilityStatusEnum = require('../../../../app/constants/eligibility-status-enum')
const claimStatusEnum = require('../../../../app/constants/claim-status-enum')
require('sinon-bluebird')

const reference = 'SUBMITF'
var eligibilityId
var claimId

var stubInsertTaskCompleteFirstTimeClaim = sinon.stub().resolves()
var stubInsertTaskSendFirstTimeClaimNotification = sinon.stub().resolves()

const submitFirstTimeClaim = proxyquire('../../../../app/services/data/submit-first-time-claim', {
  './insert-task-complete-first-time-claim': stubInsertTaskCompleteFirstTimeClaim,
  './insert-task-send-first-time-claim-notification': stubInsertTaskSendFirstTimeClaimNotification
})

describe('services/data/submit-first-time-claim', function () {
  before(function () {
    return eligiblityHelper.insertEligibilityClaim(reference)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  it('should update Eligibility and Claim status and DateSubmitted then call insertTaskSendFirstTimeClaimNotification', function () {
    var currentDate = new Date()

    submitFirstTimeClaim(reference, eligibilityId, claimId)
      .then(function () {
        knex.first().from('ExtSchema.Eligibility').where('Reference', reference)
          .then(function (eligibility) {
            return knex.first().from('ExtSchema.Claim').where('Reference', reference)
              .then(function (claim) {
                expect(eligibility.Status).to.equal(eligibilityStatusEnum.SUBMITTED)
                expect(eligibility.DateSubmitted).to.be.within(currentDate.setMinutes(currentDate.getMinutes() - 2), currentDate.setMinutes(currentDate.getMinutes() + 2))

                expect(claim.Status).to.equal(claimStatusEnum.SUBMITTED)
                expect(claim.DateSubmitted).to.be.within(currentDate.setMinutes(currentDate.getMinutes() - 2), currentDate.setMinutes(currentDate.getMinutes() + 2))

                expect(stubInsertTaskCompleteFirstTimeClaim.calledWith(reference, eligibilityId, claimId)).to.be.true
                expect(stubInsertTaskSendFirstTimeClaimNotification.calledWith(reference, eligibilityId, claimId)).to.be.true
              })
          })
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(reference)
  })
})
