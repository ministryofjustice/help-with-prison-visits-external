const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibiltyId, claimId) {
  return knex.raw(`SELECT * FROM [IntSchema].[getLastClaimForReference] (?, ?)`, [ reference, eligibiltyId ])
  .then(function (claimIdReturned) {
    console.log(claimIdReturned)
    if (claimIdReturned.length > 0) {
      claimId = parseInt(claimIdReturned[0].ClaimId)
    }
    return knex.raw(`SELECT * FROM [IntSchema].[getClaimExpenseByIdOrLastApproved] (?, ?, ?)`, [ reference, eligibiltyId, claimId ])
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
  })
}
