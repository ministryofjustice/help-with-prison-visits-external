const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const eligiblityHelper = require('../../../helpers/data/eligibility-helper')
const eligibilityStatusEnum = require('../../../../app/constants/eligibility-status-enum')
const claimStatusEnum = require('../../../../app/constants/claim-status-enum')
require('sinon-bluebird')

const REFERENCE = 'SUBMITF'
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
    return eligiblityHelper.insertEligibilityClaim(REFERENCE)
      .then(function (ids) {
        eligibilityId = ids.eligibilityId
        claimId = ids.claimId
      })
  })

  it('should update Eligibility and Claim status and DateSubmitted then call insertTaskSendFirstTimeClaimNotification', function () {
    var currentDate = new Date()

    submitFirstTimeClaim(REFERENCE, eligibilityId, claimId)
      .then(function () {
        knex.first().from('ExtSchema.Eligibility').where('Reference', REFERENCE)
          .then(function (eligibility) {
            return knex.first().from('ExtSchema.Claim').where('Reference', REFERENCE)
              .then(function (claim) {
                expect(eligibility.Status).to.equal(eligibilityStatusEnum.SUBMITTED)
                expect(eligibility.DateSubmitted).to.be.within(currentDate.setMinutes(currentDate.getMinutes() - 2), currentDate.setMinutes(currentDate.getMinutes() + 2))

                expect(claim.Status).to.equal(claimStatusEnum.SUBMITTED)
                expect(claim.DateSubmitted).to.be.within(currentDate.setMinutes(currentDate.getMinutes() - 2), currentDate.setMinutes(currentDate.getMinutes() + 2))

                expect(stubInsertTaskCompleteFirstTimeClaim.calledWith(REFERENCE, eligibilityId, claimId)).to.be.true
                expect(stubInsertTaskSendFirstTimeClaimNotification.calledWith(REFERENCE, eligibilityId, claimId)).to.be.true
              })
          })
      })
  })

  it('should throw an error if no valid claim', function () {
    return submitFirstTimeClaim('NONE123', 4321, 123456)
      .catch(function (error) {
        expect(error.message).to.contain('Could not find Claim')
      })
  })

  after(function () {
    return eligiblityHelper.deleteAll(REFERENCE)
  })
})
