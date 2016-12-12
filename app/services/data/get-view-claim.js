const documentTypeEnum = require('../../constants/document-type-enum')
const getRepeatEligibility = require('./get-repeat-eligibility')
const getClaimExpenseByIdOrLastApproved = require('./get-claim-expense-by-id-or-last-approved')
const getClaimChildrenByIdOrLastApproved = require('./get-claim-children-by-id-or-last-approved')
const getHistoricClaimByClaimId = require('./get-historic-claim-by-claim-id')
const getClaimDocumentsHistoricClaim = require('./get-claim-documents-historic-claim')
const getAllClaimDocumentsByClaimId = require('./get-all-claim-documents-by-claim-id')
const getClaimEvents = require('./get-claim-events')
const displayHelper = require('../../views/helpers/display-helper')

module.exports = function (claimId, reference, dob) {
  return getHistoricClaimByClaimId(reference, dob, claimId)
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
      return getClaimDocumentsHistoricClaim(reference, claimId)
        .then(function (claimDocuments) {
          return getClaimExpenseByIdOrLastApproved(reference, null, claimId)
            .then(function (claimExpenses) {
              return getAllClaimDocumentsByClaimId(claimId)
                .then(function (externalClaimDocuments) {
                  claimExpenses.forEach(function (expense) {
                    expense.Cost = Number(expense.Cost).toFixed(2)
                  })
                  var externalDocumentMap = {}
                  var multiPageDocuments = []
                  externalClaimDocuments.forEach(function (document) {
                    var key = `${document.DocumentType}${document.ClaimExpenseId}`
                    if (key in externalDocumentMap) {
                      multiPageDocuments.push(document)
                    } else {
                      externalDocumentMap[key] = document
                    }
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
                            expense.DocumentType = externalDocumentMap[key].DocumentType
                            expense.DocumentStatus = externalDocumentMap[key].DocumentStatus
                            expense.ClaimDocumentId = externalDocumentMap[key].ClaimDocumentId
                            expense.fromInternalWeb = false
                          } else {
                            expense.DocumentType = document.DocumentType
                            expense.DocumentStatus = document.DocumentStatus
                            expense.fromInternalWeb = true
                          }
                        }
                      })
                    } else {
                      if (key in externalDocumentMap) {
                        if (displayHelper.getBenefitMultipage(document.DocumentType)) {
                          multiPageDocuments.forEach(function (otherBenefitDocument) {
                            otherBenefitDocument.fromInternalWeb = false
                            claim.benefitDocument.push(otherBenefitDocument)
                          })
                        }
                        externalDocumentMap[key].fromInternalWeb = false
                        claim.benefitDocument.push(externalDocumentMap[key])
                      } else {
                        document.fromInternalWeb = true
                        claim.benefitDocument.push(document)
                      }
                    }
                  })
                  return claimExpenses
                })
            })
        })
        .then(function (claimExpenses) {
          return getClaimEvents(reference, claimId)
            .then(function (claimEvents) {
              return getClaimChildrenByIdOrLastApproved(reference, null, claimId)
                .then(function (claimChild) {
                  return {
                    claim: claim,
                    claimExpenses: claimExpenses,
                    claimChild: claimChild,
                    claimEvents: claimEvents
                  }
                })
            })
        })
    })
}
