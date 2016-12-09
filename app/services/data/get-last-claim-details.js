const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')

module.exports = function (reference, eligibilityId, claimId) {
  var children

  return getClaimChildrenByIdOrLastApproved(reference, eligibilityId, claimId)
    .then(function (lastClaimChildren) {
      children = lastClaimChildren
      return getClaimExpenseByIdOrLastApproved(reference, eligibilityId, claimId)
    })
    .then(function (lastClaimExpenses) {
      return {
        children: children,
        expenses: lastClaimExpenses
      }
    })
}
