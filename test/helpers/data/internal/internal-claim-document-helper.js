const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)

module.exports.CLAIM_DOCUMENT_ID = Math.floor(Date.now() / 100) - 14000000000
module.exports.DOCUMENT_TYPE = 'VISIT-CONFIRMATION'
module.exports.DOCUMENT_STATUS = 'upload-later'

module.exports.CLAIM_DOCUMENT_ID2 = (Math.floor(Date.now() / 100) - 14000000000) + 1
module.exports.DOCUMENT_TYPE2 = 'RECEIPT'
module.exports.DOCUMENT_STATUS2 = 'upload-later'

module.exports.build = function (claimDocument, documentType, documentStatus) {
  return {
    ClaimDocumentId: claimDocument,
    DocumentType: documentType,
    DocumentStatus: documentStatus
  }
}

module.exports.insert = function (reference, eligibilityId, claimId, data, claimExpenseId) {
  var claimDocument = data || this.build(this.CLAIM_DOCUMENT_ID, this.DOCUMENT_TYPE, this.DOCUMENT_STATUS)
  var claimDocument2 = data || this.build(this.CLAIM_DOCUMENT_ID2, this.DOCUMENT_TYPE2, this.DOCUMENT_STATUS2)

  return knex('IntSchema.ClaimDocument').insert({
    ClaimDocumentId: claimDocument.ClaimDocumentId,
    ClaimId: claimId,
    EligibilityId: eligibilityId,
    Reference: reference,
    DocumentType: claimDocument.DocumentType,
    DocumentStatus: claimDocument.DocumentStatus
  })
  .then(function () {
    if (claimExpenseId) {
      return knex('IntSchema.ClaimDocument').insert({
        ClaimDocumentId: claimDocument2.ClaimDocumentId,
        ClaimId: claimId,
        EligibilityId: eligibilityId,
        Reference: reference,
        ClaimExpenseId: claimExpenseId,
        DocumentType: claimDocument2.DocumentType,
        DocumentStatus: claimDocument2.DocumentStatus
      })
    }
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
