const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')
const getClaimEscortByIdOrLastApproved = require('./get-claim-escort-by-id-or-last-approved')

module.exports = function (reference, eligibilityId) {
  var result = {}

  return getClaimChildrenByIdOrLastApproved(reference, eligibilityId, null)
    .then(function (lastClaimChildren) {
      result.children = lastClaimChildren
      return getClaimExpenseByIdOrLastApproved(reference, eligibilityId, null)
    })
    .then(function (lastClaimExpenses) {
      result.expenses = lastClaimExpenses
      return getClaimEscortByIdOrLastApproved(reference, eligibilityId, null)
    })
    .then(function (lastClaimEscort) {
      console.dir(lastClaimEscort)
      result.escort = lastClaimEscort

      return result
    })
}
