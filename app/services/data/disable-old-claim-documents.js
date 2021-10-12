const { getDatabaseConnector } = require('../../databaseConnector')
const FileUpload = require('../domain/file-upload')
const Promise = require('bluebird')

module.exports = function (reference, claimId, fileUpload, multipageDoc) {
  if (!(fileUpload instanceof FileUpload)) {
    throw new Error('Provided fileUpload object is not an instance of the expected class')
  }

  if (multipageDoc) {
    return Promise.resolve()
  } else {
    const db = getDatabaseConnector()

    return db('ClaimDocument')
      .update('IsEnabled', false)
      .where({
        Reference: reference,
        ClaimId: claimId,
        ClaimExpenseId: fileUpload.claimExpenseId,
        DocumentType: fileUpload.documentType
      })
  }
}
