const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const documentTypeEnum = require('../../../app/constants/document-type-enum')

module.exports.DOCUMENT_STATUS = 'uploaded'

module.exports.insertPrisonConfirmation = function (claimId) {
  return knex('ExtSchema.ClaimDocument')
    .insert({
      ClaimId: claimId,
      DocumentType: documentTypeEnum.VISIT_CONFIRMATION,
      DocumentStatus: this.DOCUMENT_STATUS,
      DateSubmitted: moment().toDate()
    })
}

module.exports.delete = function (claimId) {
  return knex.select()
    .from('ExtSchema.ClaimDocument')
    .where('ClaimId', claimId)
    .del()
}
