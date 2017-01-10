const Promise = require('bluebird')
const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const claimTypeEnum = require('../../constants/claim-type-enum')
const insertNewClaim = require('./insert-new-claim')
const getLastClaimDetails = require('./get-last-claim-details')

module.exports = function (reference, eligibilityId, claim) {
  var claimId
  var lastClaimDetails

  return insertNewClaim(reference, eligibilityId, claimTypeEnum.REPEAT_DUPLICATE, claim)
    .then(function (newClaimId) { claimId = newClaimId })
    .then(function () { return getLastClaimDetails(reference, eligibilityId) })
    .then(function (claimDetails) { lastClaimDetails = claimDetails })
    .then(function () { return insertClaimDetail('ClaimChild', reference, eligibilityId, claimId, lastClaimDetails.children) })
    .then(function () {
      lastClaimDetails.expenses.forEach(function (expense) {
        delete expense.Status
      })
      return insertClaimDetail('ClaimExpense', reference, eligibilityId, claimId, lastClaimDetails.expenses)
    })
    .then(function () {
      return insertClaimDetail('ClaimEscort', reference, eligibilityId, claimId, lastClaimDetails.escort)
    })
    .then(function () { return claimId })
}

function insertClaimDetail (tableName, reference, eligibilityId, claimId, claimDetails) {
  if (claimDetails && claimDetails.length > 0) {
    claimDetails.forEach(function (claimDetail) {
      claimDetail.Reference = reference
      claimDetail.EligibilityId = eligibilityId
      claimDetail.ClaimId = claimId
      claimDetail.IsEnabled = true
      delete claimDetail.ClaimExpenseId
    })

    return knex(tableName).insert(claimDetails)
  } else {
    return Promise.resolve()
  }
}
