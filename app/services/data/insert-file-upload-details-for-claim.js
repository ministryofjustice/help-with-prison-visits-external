const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const FileUpload = require('../domain/file-upload')

module.exports = function (fileUpload) {
  if (!(fileUpload instanceof FileUpload)) {
    throw new Error('Provided fileUpload object is not an instance of the expected class')
  }
  return knex('ClaimDocument').insert({
    ClaimId: fileUpload.claimId,
    DocumentType: fileUpload.documentType,
    ClaimExpenseId: fileUpload.claimExpenseId,
    DocumentStatus: fileUpload.documentStatus,
    FilePath: fileUpload.path,
    DateSubmitted: fileUpload.dateSubmitted
  })
}
