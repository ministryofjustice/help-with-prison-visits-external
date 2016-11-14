const insertExpense = require('../../services/data/insert-expense')

module.exports = function (reference, eligibilityId, claimId, expense) {
  return insert(reference, eligibilityId, claimId, expense)
    .then(function () {
      return insert(reference, eligibilityId, claimId, expense.tollExpense)
    })
    .then(function () {
      return insert(reference, eligibilityId, claimId, expense.parkingExpense)
    })
}

function insert (reference, eligibilityId, claimId, expense) {
  if (expense) {
    return insertExpense(reference, eligibilityId, claimId, expense)
  }
}
