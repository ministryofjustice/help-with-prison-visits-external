const getLastClaimForReference = require('./get-last-claim-for-reference')
const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')
const getClaimEscortByIdOrLastApproved = require('./get-claim-escort-by-id-or-last-approved')
const maskArrayOfNames = require('../helpers/mask-array-of-names')

module.exports = (reference, eligibilityId, mask, thisClaimIsAdvance) => {
  const result = {}
  let claimId = null
  let lastClaimWasAdvance = false
  return getLastClaimForReference(reference, eligibilityId).then(claimIdReturned => {
    if (claimIdReturned.length > 0) {
      claimId = parseInt(claimIdReturned[0].ClaimId, 10)
      lastClaimWasAdvance = claimIdReturned[0].IsAdvanceClaim
    }
    return getClaimChildrenByIdOrLastApproved(reference, eligibilityId, claimId)
      .then(lastClaimChildren => {
        if (mask) {
          result.children = maskArrayOfNames(lastClaimChildren)
        } else {
          result.children = lastClaimChildren
        }
        return getClaimExpenseByIdOrLastApproved(reference, eligibilityId, claimId)
      })
      .then(lastClaimExpenses => {
        result.expenses = lastClaimExpenses
        if (thisClaimIsAdvance !== lastClaimWasAdvance) {
          result.expenses = result.expenses.filter(expense => expense.ExpenseType !== 'train')
        }
        if (thisClaimIsAdvance) {
          result.expenses.forEach(expense => {
            if (expense.ExpenseType === 'train') {
              expense.Cost = '0'
            }
          })
        }
        return getClaimEscortByIdOrLastApproved(reference, eligibilityId, claimId)
      })
      .then(lastClaimEscort => {
        if (mask) {
          result.escort = maskArrayOfNames(lastClaimEscort)
        } else {
          result.escort = lastClaimEscort
        }
        return result
      })
  })
}
