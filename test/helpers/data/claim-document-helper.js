const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')

module.exports.DOCUMENT_STATUS = 'uploaded'

module.exports.insertPrisonConfirmation = function (claimId) {
  return knex('ExtSchema.ClaimDocument')
    .insert({
      ClaimId: claimId,
      DocumentType: 'prisonConfirmation',
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
