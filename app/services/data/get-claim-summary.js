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
        .where({'Claim.ClaimId': claimId, 'ClaimDocument.IsEnabled': true, 'ClaimDocument.ClaimExpenseId': null})
        .select('ClaimDocument.DocumentStatus', 'ClaimDocument.DocumentType', 'ClaimDocument.ClaimDocumentId')
        .orderBy('ClaimDocument.DateSubmitted', 'desc')
        .then(function (claimDocuments) {
          return knex('Claim')
            .join('ClaimExpense', 'Claim.ClaimId', '=', 'ClaimExpense.ClaimId')
            .where({ 'Claim.ClaimId': claimId, 'ClaimExpense.IsEnabled': true })
            .select()
            .then(function (claimExpenses) {
              claimExpenses.forEach(function (expense) {
                expense.Cost = Number(expense.Cost).toFixed(2)
              })
              claim.benefitDocument = []
              claimDocuments.forEach(function (document) {
                if (document.DocumentType === documentTypeEnum['VISIT_CONFIRMATION'].documentType) {
                  claim.visitConfirmation = document
                } else {
                  claim.benefitDocument.push(document)
                }
              })
              return claimExpenses
            })
        })
        .then(function (claimExpenses) {
          return knex('Claim')
            .join('ClaimChild', 'Claim.ClaimId', '=', 'ClaimChild.ClaimId')
            .where({ 'Claim.ClaimId': claimId, 'ClaimChild.IsEnabled': true })
            .select()
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
