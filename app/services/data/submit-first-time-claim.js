const Promise = require('bluebird')
const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const insertTaskCompleteFirstTimeClaim = require('./insert-task-complete-first-time-claim')
const insertTaskSendFirstTimeClaimNotification = require('./insert-task-send-first-time-claim-notification')
const eligibilityStatusEnum = require('../../constants/eligibility-status-enum')
const claimStatusEnum = require('../../constants/claim-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, claimId) {
  var dateSubmitted = dateFormatter.now().toDate()

  return Promise.all([updateEligibility(reference, eligibilityId, dateSubmitted),
                      updateClaim(claimId, dateSubmitted),
                      insertTaskCompleteFirstTimeClaim(reference, eligibilityId, claimId),
                      insertTaskSendFirstTimeClaimNotification(reference, eligibilityId, claimId)])
}

function updateEligibility (reference, eligibilityId, dateSubmitted) {
  return knex('Eligibility').where({'Reference': reference, 'EligibilityId': eligibilityId}).update({
    'Status': eligibilityStatusEnum.SUBMITTED,
    'DateSubmitted': dateSubmitted
  })
}

function updateClaim (claimId, dateSubmitted) {
  return knex('Claim').where('ClaimId', claimId).update({
    'Status': claimStatusEnum.SUBMITTED,
    'DateSubmitted': dateSubmitted
  })
}
