const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const FileUpload = require('../../../app/services/domain/file-upload')

module.exports.DOCUMENT_TYPE = 'VISIT-CONFIRMATION'
module.exports.DOCUMENT_STATUS = 'uploaded'
module.exports.PATH = 'path'

module.exports.build = function (claimId) {
  return new FileUpload(
    claimId,
    'VISIT_CONFIRMATION',
    undefined,
    {path: this.PATH},
    undefined,
    undefined
  )
}

module.exports.insert = function (claimId, date) {
  return knex('ExtSchema.ClaimDocument')
    .insert({
      ClaimId: claimId,
      DocumentType: this.DOCUMENT_TYPE,
      DocumentStatus: this.DOCUMENT_STATUS,
      DateSubmitted: moment().toDate(),
      Filepath: this.PATH
    })
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('ExtSchema.ClaimDocument')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex.select()
    .from('ExtSchema.ClaimDocument')
    .where('ClaimId', claimId)
    .del()
}
