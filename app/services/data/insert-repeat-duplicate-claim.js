const { getDatabaseConnector } = require('../../databaseConnector')
const claimTypeEnum = require('../../constants/claim-type-enum')
const insertNewClaim = require('./insert-new-claim')
const getLastClaimDetails = require('./get-last-claim-details')

module.exports = function (reference, eligibilityId, claim) {
  let claimId
  let lastClaimDetails

  return insertNewClaim(reference, eligibilityId, claimTypeEnum.REPEAT_DUPLICATE, claim)
    .then(function (newClaimId) { claimId = newClaimId })
    .then(function () { return getLastClaimDetails(reference, eligibilityId, false, claim.isAdvanceClaim) })
    .then(function (claimDetails) {
      lastClaimDetails = claimDetails
    })
    .then(function () { return insertClaimDetail('ClaimChild', reference, eligibilityId, claimId, lastClaimDetails.children) })
    .then(function () {
      lastClaimDetails.expenses.forEach(function (expense) {
        delete expense.Status
        delete expense.RequestedCost
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

    const db = getDatabaseConnector()

    return db(tableName).insert(claimDetails)
  }

  return Promise.resolve()
}
