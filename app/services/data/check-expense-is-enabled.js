const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (claimExpenseId) {
  return knex('ClaimExpense')
    .select('IsEnabled')
    .where({ ClaimExpenseId: claimExpenseId })
}
