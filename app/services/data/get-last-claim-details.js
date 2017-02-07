const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')
const getClaimEscortByIdOrLastApproved = require('./get-claim-escort-by-id-or-last-approved')
const maskArrayOfNames = require('../helpers/mask-array-of-names')

module.exports = function (reference, eligibilityId, mask) {
  var result = {}

  return getClaimChildrenByIdOrLastApproved(reference, eligibilityId, null)
    .then(function (lastClaimChildren) {
      if (mask) {
        result.children = maskArrayOfNames(lastClaimChildren)
      } else {
        result.children = lastClaimChildren
      }

      return getClaimExpenseByIdOrLastApproved(reference, eligibilityId, null)
    })
    .then(function (lastClaimExpenses) {
      result.expenses = lastClaimExpenses
      return getClaimEscortByIdOrLastApproved(reference, eligibilityId, null)
    })
    .then(function (lastClaimEscort) {
      result.escort = lastClaimEscort

      return result
    })
}
