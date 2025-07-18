const { getDatabaseConnector } = require('../../databaseConnector')

// TODO test
module.exports = (claimId, claimExpenseId) => {
  const db = getDatabaseConnector()

  return db('ClaimExpense').where({ ClaimId: claimId, ClaimExpenseId: claimExpenseId }).update({
    IsEnabled: false,
  })
}
