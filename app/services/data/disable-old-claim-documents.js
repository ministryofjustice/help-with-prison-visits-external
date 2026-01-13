const { getDatabaseConnector } = require('../../databaseConnector')
const FileUpload = require('../domain/file-upload')
const logger = require('../log')

module.exports = (reference, claimId, fileUpload, multipageDoc) => {
  logger.info('disableOldClaimDocuments')
  if (!(fileUpload instanceof FileUpload)) {
    logger.info(`File upload is ${typeof fileUpload}`)
    throw new Error('Provided fileUpload object is not an instance of the expected class')
  }
  logger.info('fileUpload is valid')

  if (multipageDoc) {
    return Promise.resolve()
  }
  const db = getDatabaseConnector()

  return db('ClaimDocument').update('IsEnabled', false).where({
    Reference: reference,
    ClaimId: claimId,
    ClaimExpenseId: fileUpload.claimExpenseId,
    DocumentType: fileUpload.documentType,
  })
}
