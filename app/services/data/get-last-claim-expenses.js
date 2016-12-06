const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibiltyId) {
  return knex.raw(`SELECT * FROM [IntSchema].[getClaimExpenseByIdOrLastApproved] (?, ?, ?)`, [ reference, eligibiltyId, null ])
  .then(function (claimExpenses) {
    claimExpenses.forEach(function (expense) {
      expense.Cost = Number(expense.Cost).toFixed(2)
    })

    return claimExpenses
  })
}
