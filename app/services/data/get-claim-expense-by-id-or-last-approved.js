const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibiltyId, claimId) {
  return knex.raw(`SELECT * FROM [IntSchema].[getClaimExpenseByIdOrLastApproved] (?, ?, ?)`, [ reference, eligibiltyId, claimId ])
  .then(function (claimExpenses) {
    claimExpenses.forEach(function (expense) {
      expense.Cost = Number(expense.Cost).toFixed(2)
    })

    return claimExpenses
  })
}
