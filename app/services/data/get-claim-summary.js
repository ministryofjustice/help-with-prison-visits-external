const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (claimId) {
  return knex('Claim')
    .join('Eligibility', 'Claim.Reference', '=', 'Eligibility.Reference')
    .join('Visitor', 'Eligibility.Reference', '=', 'Visitor.Reference')
    .join('Prisoner', 'Eligibility.Reference', '=', 'Prisoner.Reference')
    .join('ClaimDocument', 'Claim.ClaimId', '=', 'ClaimDocument.ClaimId')
    .where('Claim.ClaimId', claimId)
    .andWhere('ClaimDocument.DocumentType', 'prison confirmation')
    .orWhere('ClaimDocument.ClaimDocumentId', null)
    .first('Eligibility.Reference', 'Claim.DateSubmitted', 'Claim.DateOfJourney', 'Visitor.FirstName', 'Visitor.LastName', 'Visitor.Benefit',
      'Prisoner.FirstName AS PrisonerFirstName', 'Prisoner.LastName AS PrisonerLastName',
      'Prisoner.DateOfBirth AS PrisonerDateOfBirth', 'Prisoner.PrisonNumber', 'Prisoner.NameOfPrison', 'ClaimDocument.DocumentStatus')
    .then(function (claim) {
      return knex('Claim')
        .join('ClaimExpense', 'Claim.ClaimId', '=', 'ClaimExpense.ClaimId')
        .where({'Claim.ClaimId': claimId, 'ClaimExpense.IsEnabled': true})
        .select('ClaimExpense.ClaimExpenseId', 'ClaimExpense.ExpenseType', 'ClaimExpense.Cost', 'ClaimExpense.To', 'ClaimExpense.From', 'ClaimExpense.IsReturn', 'ClaimExpense.TravelTime',
          'ClaimExpense.DurationOfTravel', 'ClaimExpense.TicketType')
        .orderBy('ClaimExpense.ClaimExpenseId')
        .then(function (claimExpenses) {
          claimExpenses.forEach(function (expense) {
            expense.Cost = Number(expense.Cost).toFixed(2)
          })
          return {claim: claim, claimExpenses: claimExpenses}
        })
    })
}
