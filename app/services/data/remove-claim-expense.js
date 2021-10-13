const { getDatabaseConnector } = require('../../databaseConnector')

// TODO test
module.exports = function (claimId, claimExpenseId) {
  const db = getDatabaseConnector()

  return db('ClaimExpense').where({ ClaimId: claimId, ClaimExpenseId: claimExpenseId }).update({
    IsEnabled: false
  })
}
