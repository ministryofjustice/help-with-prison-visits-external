const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (reference, eligibiltyId, claimId) => {
  const db = getDatabaseConnector()

  return db
    .raw('SELECT * FROM [IntSchema].[getClaimExpenseByIdOrLastApproved] (?, ?, ?)', [reference, eligibiltyId, claimId])
    .then(claimExpenses => {
      claimExpenses.forEach(expense => {
        if (!expense.Cost) {
          expense.Cost = '0'
        } else {
          expense.Cost = Number(expense.Cost).toFixed(2)
        }
      })
      return claimExpenses
    })
}
