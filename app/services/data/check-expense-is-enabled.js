const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = claimExpenseId => {
  const db = getDatabaseConnector()

  return db('ClaimExpense').select('IsEnabled').where({ ClaimExpenseId: claimExpenseId })
}
