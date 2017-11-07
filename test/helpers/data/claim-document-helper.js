const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const FileUpload = require('../../../app/services/domain/file-upload')

module.exports.DOCUMENT_TYPE = 'VISIT-CONFIRMATION'
module.exports.DOCUMENT_STATUS = 'uploaded'
module.exports.PATH = ''

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

module.exports.buildExpenseDoc = function (claimId, expenseId) {
  return new FileUpload(
    claimId,
    'RECEIPT',
    expenseId,
    {path: 'random/path'},
    undefined,
    undefined
  )
}

module.exports.insert = function (reference, eligibilityId, claimId, documentType) {
  return knex('ExtSchema.ClaimDocument')
    .returning('ClaimDocumentId')
    .insert({
      EligibilityId: eligibilityId,
      Reference: reference,
      ClaimId: claimId,
      DocumentType: documentType,
      DocumentStatus: this.DOCUMENT_STATUS,
      DateSubmitted: moment().toDate(),
      Filepath: this.PATH,
      IsEnabled: true
    })
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('ExtSchema.ClaimDocument')
    .where('ClaimId', claimId)
}

module.exports.getAllForExpense = function (expenseId) {
  return knex.select('*')
    .from('ExtSchema.ClaimDocument')
    .where('ClaimExpenseId', expenseId)
}

module.exports.delete = function (claimId) {
  return knex.select()
    .from('ExtSchema.ClaimDocument')
    .where('ClaimId', claimId)
    .del()
}
