const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const claimTypeEnum = require('../../constants/claim-type-enum')
const documentTypeEnum = require('../../constants/document-type-enum')
const getRepeatEligibility = require('./get-repeat-eligibility')

module.exports = function (claimId, claimType) {
  return knex('Claim')
    .leftJoin('Eligibility', 'Claim.EligibilityId', '=', 'Eligibility.EligibilityId')
    .leftJoin('Visitor', 'Eligibility.EligibilityId', '=', 'Visitor.EligibilityId')
    .leftJoin('Prisoner', 'Eligibility.EligibilityId', '=', 'Prisoner.EligibilityId')
    .where('Claim.ClaimId', claimId)
    .first(
      'Claim.EligibilityId',
      'Claim.Reference',
      'Claim.DateSubmitted',
      'Claim.DateOfJourney',
      'Claim.IsAdvanceClaim',
      'Visitor.FirstName',
      'Visitor.LastName',
      'Visitor.Benefit',
      'Prisoner.FirstName AS PrisonerFirstName',
      'Prisoner.LastName AS PrisonerLastName',
      'Prisoner.DateOfBirth AS PrisonerDateOfBirth',
      'Prisoner.PrisonNumber',
      'Prisoner.NameOfPrison',
      'Eligibility.Status AS EligibilityStatus'
    )
    .then(function (claim) {
      if ((claimType === claimTypeEnum.REPEAT_CLAIM || claimType === claimTypeEnum.REPEAT_DUPLICATE) &&
        claim.EligibilityStatus == null) {
        // Repeat claim using existing eligibility data, retrieve from IntSchema
        return getRepeatEligibility(claim.Reference, null, claim.EligibilityId)
          .then(function (eligibility) {
            claim.FirstName = eligibility.FirstName
            claim.LastName = eligibility.LastName
            claim.Benefit = eligibility.Benefit
            claim.PrisonerFirstName = eligibility.PrisonerFirstName
            claim.PrisonerLastName = eligibility.PrisonerLastName
            claim.PrisonerDateOfBirth = eligibility.PrisonerDateOfBirth
            claim.PrisonNumber = eligibility.PrisonNumber
            claim.NameOfPrison = eligibility.NameOfPrison

            return claim
          })
      }
      return claim
    })
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
            .select('ClaimExpense.*', 'ClaimDocument.DocumentStatus', 'ClaimDocument.DocumentType', 'ClaimDocument.ClaimDocumentId')
            .leftJoin('ClaimDocument', function () {
              this
                .on('ClaimExpense.ClaimId', 'ClaimDocument.ClaimId')
                .on('ClaimExpense.ClaimExpenseId', 'ClaimDocument.ClaimExpenseId')
                .on('ClaimExpense.IsEnabled', 'ClaimDocument.IsEnabled')
            })
            .then(function (claimExpenses) {
              claimExpenses.forEach(function (expense) {
                if (expense.Cost % 1 !== 0) {
                  expense.Cost = Number(expense.Cost).toFixed(2)
                }
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
            .orderBy('ClaimChild.FirstName')
            .then(function (claimChild) {
              return {
                claimExpenses: claimExpenses,
                claimChild: claimChild
              }
            })
        })
        .then(function (expensesAndChildren) {
          return knex('ClaimEscort')
            .where({
              'ClaimEscort.ClaimId': claimId,
              'ClaimEscort.IsEnabled': true
            })
            .first()
            .then(function (claimEscort) {
              return {
                claim: claim,
                claimExpenses: expensesAndChildren.claimExpenses,
                claimChild: expensesAndChildren.claimChild,
                claimEscort: claimEscort
              }
            })
        })
    })
}
