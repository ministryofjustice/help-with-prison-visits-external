const insertExpense = require('./insert-expense')

module.exports = (reference, eligibilityId, claimId, expense) => {
  return insert(reference, eligibilityId, claimId, expense)
    .then(() => {
      return insert(reference, eligibilityId, claimId, expense.tollExpense)
    })
    .then(() => {
      return insert(reference, eligibilityId, claimId, expense.parkingExpense)
    })
}

function insert(reference, eligibilityId, claimId, expense) {
  if (expense) {
    return insertExpense(reference, eligibilityId, claimId, expense)
  }

  return null
}
