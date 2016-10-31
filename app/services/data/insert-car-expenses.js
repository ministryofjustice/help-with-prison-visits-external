const insertExpense = require('../../services/data/insert-expense')

module.exports = function (expense) {
  return insert(expense)
    .then(function () {
      return insert(expense.tollExpense)
    })
    .then(function () {
      return insert(expense.parkingExpense)
    })
}

function insert (expense) {
  if (expense) {
    return insertExpense(expense)
  }
}
