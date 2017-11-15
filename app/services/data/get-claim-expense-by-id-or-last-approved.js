const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const log = require('../log')

module.exports = function (reference, eligibiltyId, claimId) {
  console.log(
    knex('IntSchema.ClaimExpense AS ClaimExpense')
      .select('ClaimExpense.ClaimExpenseId', 'ClaimExpense.ExpenseType', 'ClaimExpense.Cost AS RequestedCost', 'ClaimExpense.ApprovedCost AS Cost', 'ClaimExpense.TravelTime', 'ClaimExpense.From', 'ClaimExpense.To', 'ClaimExpense.IsReturn', 'ClaimExpense.DurationOfTravel', 'ClaimExpense.TicketType', 'ClaimExpense.TicketOwner', 'ClaimExpense.Status', 'ClaimExpense.FromPostCode', 'ClaimExpense.ToPostCode', 'ClaimExpense.Distance', 'ClaimExpense.ReturnTime')
      .where(function () {
        this.where('ClaimExpense.ClaimId', claimId)
        .andWhere('ClaimExpense.Reference', reference)
        .orWhere(function () {
          this.whereRaw(claimId + ' IS NULL')
          .whereIn('ClaimExpense.ClaimId', function () {
            this.from('IntSchema.Claim AS Claim')
            .select('Claim.ClaimId')
            .where('Claim.Reference', reference)
            .andWhere('Claim.EligibilityId', eligibiltyId)
            .andWhere('Claim.Status', 'APPROVED')
            .limit(1)
            .orderBy('Claim.DateSubmitted','DESC')
          })
        })
      })
    .andWhere('ClaimExpense.IsEnabled', 1)
    .andWhere(function () {
      this.whereNull('ClaimExpense.Status')
      .orWhere('ClaimExpense.Status', '!=', 'REJECTED')
    }).toString()
  )
  //return knex.raw(`SELECT * FROM [IntSchema].[getClaimExpenseByIdOrLastApproved] (?, ?, ?)`, [ reference, eligibiltyId, claimId ])
  return knex('IntSchema.ClaimExpense AS ClaimExpense')
  .select('ClaimExpense.ClaimExpenseId', 'ClaimExpense.ExpenseType','ClaimExpense.Cost AS RequestedCost', 'ClaimExpense.ApprovedCost AS Cost', 'ClaimExpense.TravelTime', 'ClaimExpense.From', 'ClaimExpense.To', 'ClaimExpense.IsReturn', 'ClaimExpense.DurationOfTravel', 'ClaimExpense.TicketType', 'ClaimExpense.TicketOwner', 'ClaimExpense.Status', 'ClaimExpense.FromPostCode', 'ClaimExpense.ToPostCode', 'ClaimExpense.Distance', 'ClaimExpense.ReturnTime')
  .where(function () {
    this.where('ClaimExpense.ClaimId', claimId)
    .andWhere('ClaimExpense.Reference', reference)
    .orWhere(function () {
      this.whereRaw(claimId + ' IS NULL')
      .whereIn('ClaimExpense.ClaimId', function () {
        this.from('IntSchema.Claim AS Claim')
        .select('Claim.ClaimId')
        .where('Claim.Reference', reference)
        .andWhere('Claim.EligibilityId', eligibiltyId)
        .andWhere('Claim.Status', 'APPROVED')
        .limit(1)
        .orderBy('Claim.DateSubmitted','DESC')
      })
    })
  })
  .andWhere('ClaimExpense.IsEnabled', 1)
  .andWhere(function () {
    this.whereNull('ClaimExpense.Status')
    .orWhere('ClaimExpense.Status', '!=', 'REJECTED')
  })
  .then(function (claimExpenses) {
    log.info(claimExpenses)
    claimExpenses.forEach(function (expense) {
      if (!expense.Cost) {
        expense.Cost = '0'
      } else {
        expense.Cost = Number(expense.Cost).toFixed(2)
      }
    })

    return claimExpenses
  })
}
