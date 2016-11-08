const Promise = require('bluebird')
const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const insertTaskCompleteFirstTimeClaim = require('./insert-task-complete-first-time-claim')
const insertTaskSendFirstTimeClaimNotification = require('./insert-task-send-first-time-claim-notification')
const eligibilityStatusEnum = require('../../constants/eligibility-status-enum')
const claimStatusEnum = require('../../constants/claim-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, claimId) {
  var dateSubmitted = dateFormatter.now().toDate()

  return knex('Claim')
    .where({'Reference': reference, 'ClaimId': claimId, 'Status': claimStatusEnum.IN_PROGRESS})
    .first('ClaimId')
    .then(function (result) {
      if (!result) {
        throw new Error(`Could not find Claim reference: ${reference} - claimId: ${claimId} - status: IN-PROGRESS`)
      }

      return Promise.all([updateEligibility(reference, dateSubmitted),
                          updateClaim(claimId, dateSubmitted),
                          insertTaskCompleteFirstTimeClaim(reference, claimId),
                          insertTaskSendFirstTimeClaimNotification(reference, claimId)])
    })
}

function updateEligibility (reference, dateSubmitted) {
  return knex('Eligibility').where('Reference', reference).update({
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
