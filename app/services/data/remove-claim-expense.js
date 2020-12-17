const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

// TODO test
module.exports = function (claimId, claimExpenseId) {
  return knex('ClaimExpense').where({ ClaimId: claimId, ClaimExpenseId: claimExpenseId }).update({
    IsEnabled: false
  })
}
