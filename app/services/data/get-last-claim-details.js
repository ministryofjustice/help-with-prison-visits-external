const getLastClaimForReference = require('./get-last-claim-for-reference')
const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')
const getClaimEscortByIdOrLastApproved = require('./get-claim-escort-by-id-or-last-approved')
const maskArrayOfNames = require('../helpers/mask-array-of-names')

module.exports = function (reference, eligibilityId, mask, thisClaimIsAdavnce) {
  var result = {}
  var claimId = null
  var lastClaimWasAdvance = false
  return getLastClaimForReference(reference, eligibilityId)
    .then(function (claimIdReturned) {
      if (claimIdReturned.length > 0) {
        claimId = parseInt(claimIdReturned[0].ClaimId)
        lastClaimWasAdvance = claimIdReturned[0].IsAdvanceClaim
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
          if (thisClaimIsAdavnce !== lastClaimWasAdvance) {
            result.expenses = result.expenses.filter(expense => expense.ExpenseType !== 'train')
          }
          if (thisClaimIsAdavnce) {
            result.expenses.forEach(function (expense) {
              if (expense.ExpenseType === 'train') {
                expense.Cost = '0'
              }
            })
          }
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
