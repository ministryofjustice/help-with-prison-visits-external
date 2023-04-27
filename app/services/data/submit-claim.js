const { getDatabaseConnector } = require('../../databaseConnector')
const insertTask = require('./insert-task')
const tasksEnum = require('../../constants/tasks-enum')
const eligibilityStatusEnum = require('../../constants/eligibility-status-enum')
const claimStatusEnum = require('../../constants/claim-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, claimId, claimType, assistedDigitalCaseworker, paymentMethod) {
  const dateSubmitted = dateFormatter.now().toDate()
  const setTaskStatus = assistedDigitalCaseworker === 'teste2e@test.com' ? 'TEST' : false // logic for e2e tests
  const db = getDatabaseConnector()

  return db('Claim')
    .where({ Reference: reference, EligibilityId: eligibilityId, ClaimId: claimId, Status: claimStatusEnum.IN_PROGRESS })
    .first('ClaimId')
    .then(function (result) {
      if (!result) {
        throw new Error(`Could not find Claim reference: ${reference} - claimId: ${claimId} - status: IN-PROGRESS`)
      }

      return Promise.all([updateEligibility(reference, eligibilityId, dateSubmitted),
        updateClaim(claimId, dateSubmitted, assistedDigitalCaseworker, paymentMethod)])
        .then(function () {
          return insertTask(reference, eligibilityId, claimId, tasksEnum.COMPLETE_CLAIM, claimType, setTaskStatus)
        })
    })
}

function updateEligibility (reference, eligibilityId, dateSubmitted) {
  const db = getDatabaseConnector()

  return db('Eligibility').where({ Reference: reference, EligibilityId: eligibilityId }).update({
    Status: eligibilityStatusEnum.SUBMITTED,
    DateSubmitted: dateSubmitted
  })
}

function updateClaim (claimId, dateSubmitted, assistedDigitalCaseworker, paymentMethod) {
  const db = getDatabaseConnector()

  return db('Claim').where('ClaimId', claimId).update({
    Status: claimStatusEnum.SUBMITTED,
    DateSubmitted: dateSubmitted,
    AssistedDigitalCaseworker: assistedDigitalCaseworker,
    PaymentMethod: paymentMethod
  })
}
