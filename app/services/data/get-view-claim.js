const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const documentTypeEnum = require('../../constants/document-type-enum')
const getRepeatEligibility = require('./get-repeat-eligibility')

module.exports = function (claimId, reference, dob) {
  return knex.raw(`SELECT * FROM [IntSchema].[getHistoricClaims] (?, ?) WHERE getHistoricClaims.ClaimId = (?)`, [ reference, dob, claimId ])
    .then(function (claim) {
      return getRepeatEligibility(reference, dob, null)
          .then(function (eligibility) {
            claim[0].EligibilityId = eligibility.EligibilityId
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
          return knex.raw(`SELECT * FROM [IntSchema].[getClaimExpenseByIdOrLastApproved] (?, ?, ?)`, [ reference, null, claimId ])
            .then(function (claimExpenses) {
              return knex('ClaimDocument')
                .where({'ClaimDocument.ClaimId': claimId, 'ClaimDocument.IsEnabled': true})
                .select('ClaimDocument.DocumentStatus', 'ClaimDocument.DocumentType', 'ClaimDocument.ClaimDocumentId', 'ClaimDocument.ClaimExpenseId')
                .orderBy('ClaimDocument.DateSubmitted', 'desc')
                .then(function (externalClaimDocuments) {
                  claimExpenses.forEach(function (expense) {
                    expense.Cost = Number(expense.Cost).toFixed(2)
                  })
                  var externalDocumentMap = {}
                  externalClaimDocuments.forEach(function (document) {
                    externalDocumentMap[`${document.DocumentType}${document.ClaimExpenseId}`] = document
                  })
                  claim.benefitDocument = []
                  claimDocuments.forEach(function (document) {
                    var key = `${document.DocumentType}${document.ClaimExpenseId}`
                    if (document.DocumentType === documentTypeEnum['VISIT_CONFIRMATION'].documentType) {
                      if (key in externalDocumentMap) {
                        claim.visitConfirmation = externalDocumentMap[key]
                        claim.visitConfirmation.fromInternalWeb = false
                      } else {
                        claim.visitConfirmation = document
                        claim.visitConfirmation.fromInternalWeb = true
                      }
                    } else if (document.DocumentType === documentTypeEnum['RECEIPT'].documentType) {
                      claimExpenses.forEach(function (expense) {
                        if (document.ClaimExpenseId === expense.ClaimExpenseId) {
                          if (key in externalDocumentMap) {
                            expense.DocumentType = externalClaimDocuments[key].DocumentType
                            expense.DocumentStatus = externalClaimDocuments[key].DocumentStatus
                          } else {
                            expense.DocumentType = document.DocumentType
                            expense.DocumentStatus = document.DocumentStatus
                          }
                        }
                      })
                    } else {
                      // TODO check when multipage benefit
                      if (key in externalDocumentMap) {
                        claim.benefitDocument.push(externalClaimDocuments[key])
                      } else {
                        claim.benefitDocument.push(document)
                      }
                    }
                  })
                  return claimExpenses
                })
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
