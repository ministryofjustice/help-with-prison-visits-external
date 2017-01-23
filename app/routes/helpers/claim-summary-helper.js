const removeClaimExpense = require('../../services/data/remove-claim-expense')
const removeClaimDocument = require('../../services/data/remove-claim-document')
const getClaimDocumentFilePath = require('../../services/data/get-claim-document-file-path')

// TODO: Unit test these functions.

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
      var path = result.Filepath
      if (path) {
        return {
          path: path,
          name: 'APVS-Upload.' + path.split('.').pop()
        }
      } else {
        throw new Error('No path to file provided')
      }
    })
}
