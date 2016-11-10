const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const documentTypeEnum = require('../../constants/document-type-enum')

module.exports = function (claimId) {
  return knex('Claim')
    .join('Eligibility', 'Claim.Reference', '=', 'Eligibility.Reference')
    .join('Visitor', 'Eligibility.Reference', '=', 'Visitor.Reference')
    .join('Prisoner', 'Eligibility.Reference', '=', 'Prisoner.Reference')
    .where('Claim.ClaimId', claimId)
    .first(
      'Eligibility.Reference',
      'Claim.DateSubmitted',
      'Claim.DateOfJourney',
      'Visitor.FirstName',
      'Visitor.LastName',
      'Visitor.Benefit',
      'Prisoner.FirstName AS PrisonerFirstName',
      'Prisoner.LastName AS PrisonerLastName',
      'Prisoner.DateOfBirth AS PrisonerDateOfBirth',
      'Prisoner.PrisonNumber',
      'Prisoner.NameOfPrison'
    )
    .then(function (claim) {
      return knex('ClaimDocument')
        .join('Claim', 'ClaimDocument.ClaimId', '=', 'Claim.ClaimId')
        .where({ 'ClaimDocument.DocumentType': documentTypeEnum.VISIT_CONFIRMATION, 'Claim.ClaimId': claimId })
        .first('ClaimDocument.DocumentStatus', 'ClaimDocument.DocumentType')
        .then(function (visitConfirmationDocumentStatus) {
          return knex('Claim')
            .join('ClaimExpense', 'Claim.ClaimId', '=', 'ClaimExpense.ClaimId')
            .where({ 'Claim.ClaimId': claimId, 'ClaimExpense.IsEnabled': true })
            .select(
              'ClaimExpense.ClaimExpenseId',
              'ClaimExpense.ExpenseType',
              'ClaimExpense.Cost',
              'ClaimExpense.To',
              'ClaimExpense.From',
              'ClaimExpense.IsReturn',
              'ClaimExpense.TravelTime',
              'ClaimExpense.DurationOfTravel',
              'ClaimExpense.TicketType',
              'ClaimExpense.IsChild'
            )
            .orderBy('ClaimExpense.ClaimExpenseId')
            .then(function (claimExpenses) {
              claimExpenses.forEach(function (expense) {
                expense.Cost = Number(expense.Cost).toFixed(2)
              })
              claim.visitConfirmation = visitConfirmationDocumentStatus
              return claimExpenses
            })
        })
        .then(function (claimExpenses) {
          return knex('Claim')
            .join('ClaimChild', 'Claim.ClaimId', '=', 'ClaimChild.ClaimId')
            .where({ 'Claim.ClaimId': claimId, 'ClaimChild.IsEnabled': true })
            .select(
              'ClaimChild.ClaimChildId',
              'ClaimChild.Name',
              'ClaimChild.DateOfBirth',
              'ClaimChild.Relationship'
            )
            .orderBy('ClaimChild.Name')
            .then(function (claimChild) {
              return {
                claim: claim,
                claimExpenses: claimExpenses,
                claimChild: claimChild
              }
            })
        })
    })
}
