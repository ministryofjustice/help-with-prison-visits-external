const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)

module.exports.CLAIM_DOCUMENT_ID = Math.floor(Date.now() / 100) - 14000000000
module.exports.DOCUMENT_TYPE = 'VISIT-CONFRIMATION'
module.exports.DOCUMENT_STATUS = 'PENDING'

module.exports.build = function () {
  return {
    ClaimDocumentId: this.CLAIM_DOCUMENT_ID,
    DocumentType: this.DOCUMENT_TYPE,
    DocumentStatus: this.DOCUMENT_STATUS
  }
}

module.exports.insert = function (reference, eligibilityId, claimId, data) {
  var claimDocument = data || this.build()

  return knex('IntSchema.ClaimDocument').insert({
    ClaimDocumentId: claimDocument.ClaimDocumentId,
    ClaimId: claimId,
    EligibilityId: eligibilityId,
    Reference: reference,
    DocumentType: claimDocument.DocumentType,
    DocumentStatus: claimDocument.DocumentStatus
  })
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('IntSchema.ClaimDocument')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex('IntSchema.ClaimDocument')
    .where('ClaimId', claimId)
    .del()
}
