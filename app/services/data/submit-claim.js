const Promise = require('bluebird')
const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const insertTask = require('./insert-task')
const tasksEnum = require('../../constants/tasks-enum')
const eligibilityStatusEnum = require('../../constants/eligibility-status-enum')
const claimStatusEnum = require('../../constants/claim-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, claimId, claimType, assistedDigitalCaseworker, paymentMethod, isTest) {
  var dateSubmitted = dateFormatter.now().toDate()
  var task = isTest ? 'TEST' : tasksEnum.COMPLETE_CLAIM

  return knex('Claim')
    .where({'Reference': reference, 'EligibilityId': eligibilityId, 'ClaimId': claimId, 'Status': claimStatusEnum.IN_PROGRESS})
    .first('ClaimId')
    .then(function (result) {
      if (!result) {
        throw new Error(`Could not find Claim reference: ${reference} - claimId: ${claimId} - status: IN-PROGRESS`)
      }

      return Promise.all([updateEligibility(reference, eligibilityId, dateSubmitted),
        updateClaim(claimId, dateSubmitted, assistedDigitalCaseworker, paymentMethod)])
          .then(function () {
            return insertTask(reference, eligibilityId, claimId, task, claimType)
          })
    })
}

function updateEligibility (reference, eligibilityId, dateSubmitted) {
  return knex('Eligibility').where({'Reference': reference, 'EligibilityId': eligibilityId}).update({
    'Status': eligibilityStatusEnum.SUBMITTED,
    'DateSubmitted': dateSubmitted
  })
}

function updateClaim (claimId, dateSubmitted, assistedDigitalCaseworker, paymentMethod) {
  return knex('Claim').where('ClaimId', claimId).update({
    'Status': claimStatusEnum.SUBMITTED,
    'DateSubmitted': dateSubmitted,
    'AssistedDigitalCaseworker': assistedDigitalCaseworker,
    'PaymentMethod': paymentMethod
  })
}
