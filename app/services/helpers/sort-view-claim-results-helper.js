const displayHelper = require('../../views/helpers/display-helper')
const documentTypeEnum = require('../../constants/document-type-enum')

module.exports = (claim, eligibility, claimDocuments, claimExpenses, externalClaimDocuments) => {
  sortClaimAndEligibility(claim, eligibility)
  return sortClaimDocumentsAndExpenses(claim, claimDocuments, claimExpenses, externalClaimDocuments)
}

function sortClaimAndEligibility(claim, eligibility) {
  claim.EligibilityId = eligibility.EligibilityId
  claim.FirstName = eligibility.FirstName
  claim.LastName = eligibility.LastName
  claim.Benefit = eligibility.Benefit
  claim.PrisonerFirstName = eligibility.PrisonerFirstName
  claim.PrisonerLastName = eligibility.PrisonerLastName
  claim.PrisonNumber = eligibility.PrisonNumber
  claim.NameOfPrison = eligibility.NameOfPrison
  return claim
}

function sortClaimDocumentsAndExpenses(claim, claimDocuments, claimExpenses, externalClaimDocuments) {
  claimExpenses.forEach(expense => {
    if (!expense.Status || expense.Status === 'REQUEST-INFORMATION') {
      expense.Cost = expense.RequestedCost
    }
    if (!expense.Cost) {
      expense.Cost = 0
    }
  })
  const externalDocumentMap = {}
  const multiPageDocuments = []
  externalClaimDocuments.forEach(document => {
    const key = `${document.DocumentType}${document.ClaimExpenseId}`
    if (key in externalDocumentMap) {
      multiPageDocuments.push(document)
    } else {
      externalDocumentMap[key] = document
    }
  })
  claim.benefitDocument = []
  if (claim.IsAdvanceClaim) {
    addPlaceholderDocumentsForAdanceClaims(claimDocuments, claimExpenses)
  }

  claimDocuments.forEach(document => {
    const key = `${document.DocumentType}${document.ClaimExpenseId}`
    if (document.DocumentType === documentTypeEnum.VISIT_CONFIRMATION.documentType) {
      if (key in externalDocumentMap) {
        claim.visitConfirmation = externalDocumentMap[key]
        claim.visitConfirmation.fromInternalWeb = false
      } else {
        claim.visitConfirmation = document
        claim.visitConfirmation.fromInternalWeb = true
      }
    } else if (document.DocumentType === documentTypeEnum.RECEIPT.documentType) {
      claimExpenses.forEach(expense => {
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
    } else if (key in externalDocumentMap) {
      if (displayHelper.getBenefitMultipage(document.DocumentType)) {
        multiPageDocuments.forEach(otherBenefitDocument => {
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
  })
  return claimExpenses
}

function addPlaceholderDocumentsForAdanceClaims(claimDocuments, claimExpenses) {
  const documents = []
  claimDocuments.forEach(document => {
    if (document.ClaimExpenseId) {
      documents.push(document.ClaimExpenseId)
    } else {
      documents.push(document.DocumentType)
    }
  })
  if (documents.indexOf(documentTypeEnum.VISIT_CONFIRMATION.documentType) === -1) {
    claimDocuments.push({ DocumentType: documentTypeEnum.VISIT_CONFIRMATION.documentType, ClaimExpenseId: null })
  }
  claimExpenses.forEach(expense => {
    if (documents.indexOf(expense.ClaimExpenseId) === -1) {
      claimDocuments.push({
        DocumentType: documentTypeEnum.RECEIPT.documentType,
        ClaimExpenseId: expense.ClaimExpenseId,
      })
    }
  })
}
