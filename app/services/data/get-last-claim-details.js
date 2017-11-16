const getLastClaimForReference = require('./get-last-claim-for-reference')
const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')
const getClaimEscortByIdOrLastApproved = require('./get-claim-escort-by-id-or-last-approved')
const maskArrayOfNames = require('../helpers/mask-array-of-names')

module.exports = function (reference, eligibilityId, mask) {
  var result = {}
  var claimId = null
  return getLastClaimForReference(reference, eligibilityId)
    .then(function (claimIdReturned) {
      console.log(claimIdReturned)
      if (claimIdReturned.length > 0) {
        claimId = parseInt(claimIdReturned[0].ClaimId)
      }
      return getClaimChildrenByIdOrLastApproved(reference, eligibilityId, claimId)
        .then(function (lastClaimChildren) {
          if (mask) {
            result.children = maskArrayOfNames(lastClaimChildren)
          } else {
            result.children = lastClaimChildren
          }
          return getClaimExpenseByIdOrLastApproved(reference, eligibilityId, claimId)
        })
        .then(function (lastClaimExpenses) {
          result.expenses = lastClaimExpenses
          return getClaimEscortByIdOrLastApproved(reference, eligibilityId, claimId)
        })
        .then(function (lastClaimEscort) {
          if (mask) {
            result.escort = maskArrayOfNames(lastClaimEscort)
          } else {
            result.escort = lastClaimEscort
          }
          return result
        })
    })
}
