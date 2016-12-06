const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const documentTypeEnum = require('../../constants/document-type-enum')
const getRepeatEligibility = require('./get-repeat-eligibility')

module.exports = function (claimId, reference, dob) {
  return knex.raw(`SELECT * FROM [IntSchema].[getHistoricClaims] (?, ?) WHERE getHistoricClaims.ClaimId = (?)`, [ reference, dob, claimId ])
    .then(function (claim) {
      return getRepeatEligibility(reference, dob, null)
          .then(function (eligibility) {
            claim[0].FirstName = eligibility.FirstName
            claim[0].LastName = eligibility.LastName
            claim[0].Benefit = eligibility.Benefit
            claim[0].PrisonerFirstName = eligibility.PrisonerFirstName
            claim[0].PrisonerLastName = eligibility.PrisonerLastName
            claim[0].PrisonNumber = eligibility.PrisonNumber
            claim[0].NameOfPrison = eligibility.NameOfPrison

            return claim[0]
          })
    })
    .then(function (claim) {
      return knex.raw(`SELECT * FROM [IntSchema].[getClaimDocumentsHistoricClaim] (?, ?)`, [ reference, claimId ])
        .then(function (claimDocuments) {
          console.log(claimDocuments)
          return knex.raw(`SELECT * FROM [IntSchema].[getClaimExpenseByIdOrLastApproved] (?, ?, ?)`, [ reference, null, claimId ])
            .then(function (claimExpenses) {
              claimExpenses.forEach(function (expense) {
                expense.Cost = Number(expense.Cost).toFixed(2)
              })
              claim.benefitDocument = []
              claimDocuments.forEach(function (document) {
                if (document.DocumentType === documentTypeEnum['VISIT_CONFIRMATION'].documentType) {
                  claim.visitConfirmation = document
                } else if (document.DocumentType === documentTypeEnum['RECEIPT'].documentType) {
                  claimExpenses.forEach(function (expense) {
                    if (document.ClaimExpenseId === expense.ClaimExpenseId) {
                      expense.DocumentType = document.DocumentType
                      expense.DocumentStatus = document.DocumentStatus
                    }
                  })
                } else {
                  claim.benefitDocument.push(document)
                }
              })
              return claimExpenses
            })
        })
        .then(function (claimExpenses) {
          return knex.raw(`SELECT * FROM [IntSchema].[getClaimChildrenByIdOrLastApproved] (?, ?, ?)`, [ reference, null, claimId ])
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
