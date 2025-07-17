const removeClaimExpense = require('../../services/data/remove-claim-expense')
const removeClaimDocument = require('../../services/data/remove-claim-document')
const getClaimDocumentFilePath = require('../../services/data/get-claim-document-file-path')

const DEFAULT_FILE_NAME = 'HwPV-Upload'

module.exports.buildClaimSummaryUrl = req => {
  return '/apply/eligibility/claim/summary'
}

module.exports.buildRemoveDocumentUrl = req => {
  const url = this.buildClaimSummaryUrl(req)
  if (req.query?.multipage) {
    return url
  } else if (req.query?.claimExpenseId) {
    return `${url}/file-upload?document=${req.query?.document}&claimExpenseId=${req.query?.claimExpenseId}`
  } else {
    return `${url}/file-upload?document=${req.query?.document}`
  }
}

module.exports.removeExpense = (claimId, claimExpenseId) => {
  return removeClaimExpense(claimId, claimExpenseId)
}

module.exports.removeDocument = claimDocumentId => {
  return removeClaimDocument(claimDocumentId)
}

module.exports.removeExpenseAndDocument = function (claimId, claimExpenseId, claimDocumentId) {
  const self = this
  return self.removeExpense(claimId, claimExpenseId)
    .then(() => { return self.removeDocument(claimDocumentId) })
}

module.exports.getBenefitDocument = function (benefitDocument) {
  let result
  if (benefitDocument && benefitDocument.length > 0) {
    result = benefitDocument[0]
  }
  return result
}

module.exports.getDocumentFilePath = claimDocumentId => {
  return getClaimDocumentFilePath(claimDocumentId)
    .then(result => {
      if (result && result.Filepath) {
        const path = result.Filepath
        return {
          path,
          name: `${DEFAULT_FILE_NAME}.${path.split('.').pop()}`
        }
      }

      throw new Error(`Could not find the path to the document with claim document id ${claimDocumentId}`)
    })
    .catch(function (_error) {
      throw new Error(`Could not find the path to the document with claim document id ${claimDocumentId}`)
    })
}
