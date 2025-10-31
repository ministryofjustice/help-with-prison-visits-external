const { getDatabaseConnector } = require('../../databaseConnector')
const FileUpload = require('../domain/file-upload')

module.exports = (reference, claimId, fileUpload, multipageDoc, fileUploadSupplied = true) => {
  if (fileUploadSupplied && !(fileUpload instanceof FileUpload)) {
    throw new Error('Provided fileUpload object is not an instance of the expected class (Disable old claim)')
  }

  if (multipageDoc) {
    return Promise.resolve()
  }

  const db = getDatabaseConnector()

  return db('ClaimDocument')
    .update('IsEnabled', false)
    .where({
      Reference: reference,
      ClaimId: claimId,
      ClaimExpenseId: fileUpload.claimExpenseId ?? 0,
      DocumentType: fileUpload.documentType ?? '',
    })
}
