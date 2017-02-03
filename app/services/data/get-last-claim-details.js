const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')
const getClaimEscortByIdOrLastApproved = require('./get-claim-escort-by-id-or-last-approved')
const maskString = require('../helpers/mask-string')

module.exports = function (reference, eligibilityId, maskChildName) {
  var result = {}

  return getClaimChildrenByIdOrLastApproved(reference, eligibilityId, null)
    .then(function (lastClaimChildren) {
      if (maskChildName) {
        result.children = lastClaimChildren.map(function (claimChild) {
          claimChild.LastName = maskString(claimChild.LastName, 1)
          return claimChild
        })
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
