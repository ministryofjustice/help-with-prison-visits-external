const getLastClaimChildren = require('./get-last-claim-children')
const getLastClaimExpenses = require('./get-last-claim-expenses')

module.exports = function (reference, eligibilityId) {
  var children

  return getLastClaimChildren(reference, eligibilityId)
    .then(function (lastClaimChildren) {
      children = lastClaimChildren
      return getLastClaimExpenses(reference, eligibilityId)
    })
    .then(function (lastClaimExpenses) {
      return {
        children: children,
        expenses: lastClaimExpenses
      }
    })
}
