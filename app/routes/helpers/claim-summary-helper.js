const removeClaimExpense = require('../../services/data/remove-claim-expense')
const removeClaimDocument = require('../../services/data/remove-claim-document')
const getClaimDocumentFilePath = require('../../services/data/get-claim-document-file-path')

const DEFAULT_FILE_NAME = 'APVS-Upload.'

module.exports.buildClaimSummaryUrl = function (req) {
  return `/apply/${req.params.claimType}/eligibility/${req.params.referenceId}/claim/${req.params.claimId}/summary`
}

module.exports.buildRemoveDocumentUrl = function (req) {
  var url = this.buildClaimSummaryUrl(req)
  if (req.query.multipage) {
    return url
  } else if (req.query.claimExpenseId) {
    return `${url}/file-upload?document=${req.query.document}&claimExpenseId=${req.query.claimExpenseId}`
  } else {
    return `${url}/file-upload?document=${req.query.document}`
  }
}

module.exports.removeExpense = function (claimId, claimExpenseId) {
  return removeClaimExpense(claimId, claimExpenseId)
}

module.exports.removeDocument = function (claimDocumentId) {
  return removeClaimDocument(claimDocumentId)
}

module.exports.removeExpenseAndDocument = function (claimId, claimExpenseId, claimDocumentId) {
  var self = this
  return self.removeExpense(claimId, claimExpenseId)
    .then(function () { return self.removeDocument(claimDocumentId) })
}

module.exports.getBenefitDocument = function (benefitDocument) {
  var result
  if (benefitDocument && benefitDocument.length > 0) {
    result = benefitDocument[0]
  }
  return result
}

module.exports.getDocumentFilePath = function (claimDocumentId) {
  return getClaimDocumentFilePath(claimDocumentId)
    .then(function (result) {
      if (result && result.Filepath) {
        var path = result.Filepath
        return {
          path: path,
          name: DEFAULT_FILE_NAME + path.split('.').pop()
        }
      }
      throw new Error(`Could not find the path to the document with claim document id ${claimDocumentId}`)
    })
}
