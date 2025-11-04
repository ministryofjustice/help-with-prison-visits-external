const { getDatabaseConnector } = require('../../databaseConnector')
const FileUpload = require('../domain/file-upload')

module.exports = (reference, eligibilityId, claimId, fileUpload, fileUploadSupplied = true) => {
  if (fileUploadSupplied && !(fileUpload instanceof FileUpload)) {
    throw new Error('Provided fileUpload object is not an instance of the expected class (Upload for claim)')
  }

  const db = getDatabaseConnector()

  return db('ClaimDocument').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimId: claimId,
    DocumentType: fileUpload.documentType ?? '',
    ClaimExpenseId: fileUpload.claimExpenseId ?? 0,
    DocumentStatus: fileUpload.documentStatus ?? '',
    Filepath: fileUpload.path ?? '',
    DateSubmitted: fileUpload.dateSubmitted ?? '',
    IsEnabled: true,
  })
}
