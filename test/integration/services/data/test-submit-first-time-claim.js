const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const dateFormatter = require('../../../../app/services/date-formatter')
const eligibilityStatusEnum = require('../../../../app/constants/eligibility-status-enum')
const claimStatusEnum = require('../../../../app/constants/claim-status-enum')
require('sinon-bluebird')

const reference = 'S123456'
var claimId

var stubInsertTaskCompleteFirstTimeClaim = sinon.stub().resolves()
var stubInsertTaskSendFirstTimeClaimNotification = sinon.stub().resolves()

const submitFirstTimeClaim = proxyquire('../../../../app/services/data/submit-first-time-claim', {
  './insert-task-complete-first-time-claim': stubInsertTaskCompleteFirstTimeClaim,
  './insert-task-send-first-time-claim-notification': stubInsertTaskSendFirstTimeClaimNotification
})

describe('services/data/submit-first-time-claim', function () {
  before(function () {
    return knex('ExtSchema.Eligibility').insert({
      Reference: reference,
      DateCreated: dateFormatter.now().toDate(),
      Status: eligibilityStatusEnum.IN_PROGRESS
    })
    .then(function () {
      return knex('ExtSchema.Claim').insert({
        Reference: reference,
        DateOfJourney: dateFormatter.now().toDate(),
        DateCreated: dateFormatter.now().toDate(),
        Status: claimStatusEnum.IN_PROGRESS
      })
      .returning('ClaimId')
      .then(function (result) {
        claimId = result[0]
      })
    })
  })

  it('should update Eligibility and Claim status and DateSubmitted then call insertTaskSendFirstTimeClaimNotification', function () {
    var currentDate = new Date()

    return submitFirstTimeClaim(reference, claimId)
      .then(function () {
        knex.first().from('ExtSchema.Eligibility').where('Reference', reference)
          .then(function (eligibility) {
            return knex.first().from('ExtSchema.Claim').where('Reference', reference)
              .then(function (claim) {
                expect(eligibility.Status).to.equal(eligibilityStatusEnum.SUBMITTED)
                expect(eligibility.DateSubmitted).to.be.within(currentDate.setMinutes(currentDate.getMinutes() - 2), currentDate.setMinutes(currentDate.getMinutes() + 2))

                expect(claim.Status).to.equal(claimStatusEnum.SUBMITTED)
                expect(claim.DateSubmitted).to.be.within(currentDate.setMinutes(currentDate.getMinutes() - 2), currentDate.setMinutes(currentDate.getMinutes() + 2))

                expect(stubInsertTaskCompleteFirstTimeClaim.calledWith(reference, claimId)).to.be.true
                expect(stubInsertTaskSendFirstTimeClaimNotification.calledWith(reference, claimId)).to.be.true
              })
          })
      })
  })

  it('should throw an error if no valid claim', function () {
    return submitFirstTimeClaim('NONE123', 123456)
      .catch(function (error) {
        expect(error.message).to.contain('Could not find Claim')
      })
  })

  after(function () {
    return knex('ExtSchema.Claim').where('ClaimId', claimId).del()
      .then(function () {
        return knex('ExtSchema.Eligibility').where('Reference', reference).del()
      })
  })
})
