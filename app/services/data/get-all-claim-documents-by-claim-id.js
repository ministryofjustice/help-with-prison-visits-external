const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (claimId, reference, eligibilityId) {
  const db = getDatabaseConnector()

  return db('ClaimDocument')
    .where({ 'ClaimDocument.ClaimId': claimId, 'ClaimDocument.IsEnabled': true })
    .orWhere({ 'ClaimDocument.ClaimId': null, 'ClaimDocument.Reference': reference, 'ClaimDocument.EligibilityId': eligibilityId, 'ClaimDocument.IsEnabled': true })
    .select('ClaimDocument.DocumentStatus', 'ClaimDocument.DocumentType', 'ClaimDocument.ClaimDocumentId', 'ClaimDocument.ClaimExpenseId')
    .orderBy('ClaimDocument.DateSubmitted', 'desc')
}
