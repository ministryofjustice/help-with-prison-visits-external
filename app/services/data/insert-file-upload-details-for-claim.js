const { getDatabaseConnector } = require('../../databaseConnector')
const FileUpload = require('../domain/file-upload')

module.exports = function (reference, eligibilityId, claimId, fileUpload) {
  if (!(fileUpload instanceof FileUpload)) {
    throw new Error('Provided fileUpload object is not an instance of the expected class')
  }

  const db = getDatabaseConnector()

  return db('ClaimDocument').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimId: claimId,
    DocumentType: fileUpload.documentType,
    ClaimExpenseId: fileUpload.claimExpenseId,
    DocumentStatus: fileUpload.documentStatus,
    Filepath: fileUpload.path,
    DateSubmitted: fileUpload.dateSubmitted,
    IsEnabled: true
  })
}
