const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (reference, eligibiltyId, claimId) {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getClaimExpenseByIdOrLastApproved] (?, ?, ?)', [reference, eligibiltyId, claimId])
    .then(function (claimExpenses) {
      claimExpenses.forEach(function (expense) {
        if (!expense.Cost) {
          expense.Cost = '0'
        } else {
          expense.Cost = Number(expense.Cost).toFixed(2)
        }
      })
      return claimExpenses
    })
}
