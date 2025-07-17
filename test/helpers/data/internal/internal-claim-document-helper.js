const { getDatabaseConnector } = require('../../../../app/databaseConnector')

module.exports.CLAIM_DOCUMENT_ID = Math.floor(Date.now() / 100) - 15000000000
module.exports.DOCUMENT_TYPE = 'VISIT-CONFIRMATION'
module.exports.DOCUMENT_STATUS = 'upload-later'

module.exports.CLAIM_DOCUMENT_ID2 = Math.floor(Date.now() / 100) - 15000000000 + 1
module.exports.DOCUMENT_TYPE2 = 'RECEIPT'
module.exports.DOCUMENT_STATUS2 = 'upload-later'

module.exports.build = (claimDocument, documentType, documentStatus) => {
  return {
    ClaimDocumentId: claimDocument,
    DocumentType: documentType,
    DocumentStatus: documentStatus,
  }
}

module.exports.insert = (reference, eligibilityId, claimId, data, claimExpenseId) => {
  const claimDocument = data || this.build(this.CLAIM_DOCUMENT_ID, this.DOCUMENT_TYPE, this.DOCUMENT_STATUS)
  const claimDocument2 = data || this.build(this.CLAIM_DOCUMENT_ID2, this.DOCUMENT_TYPE2, this.DOCUMENT_STATUS2)
  const db = getDatabaseConnector()

  return db('IntSchema.ClaimDocument')
    .insert({
      ClaimDocumentId: claimDocument.ClaimDocumentId,
      ClaimId: claimId,
      EligibilityId: eligibilityId,
      Reference: reference,
      DocumentType: claimDocument.DocumentType,
      DocumentStatus: claimDocument.DocumentStatus,
      IsEnabled: true,
    })
    .then(() => {
      if (claimExpenseId) {
        return db('IntSchema.ClaimDocument').insert({
          ClaimDocumentId: claimDocument2.ClaimDocumentId,
          ClaimId: claimId,
          EligibilityId: eligibilityId,
          Reference: reference,
          ClaimExpenseId: claimExpenseId,
          DocumentType: claimDocument2.DocumentType,
          DocumentStatus: claimDocument2.DocumentStatus,
          IsEnabled: true,
        })
      }

      return null
    })
}

module.exports.get = claimId => {
  const db = getDatabaseConnector()

  return db.first().from('IntSchema.ClaimDocument').where('ClaimId', claimId)
}

module.exports.delete = claimId => {
  const db = getDatabaseConnector()

  return db('IntSchema.ClaimDocument').where('ClaimId', claimId).del()
}
