const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (claimExpenseId) {
  const db = getDatabaseConnector()

  return db('ClaimExpense')
    .select('IsEnabled')
    .where({ ClaimExpenseId: claimExpenseId })
}
