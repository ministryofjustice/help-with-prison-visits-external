const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (claimId, reference, eligibilityId) {
  return knex('ClaimDocument')
    .where({ 'ClaimDocument.ClaimId': claimId, 'ClaimDocument.IsEnabled': true })
    .orWhere({ 'ClaimDocument.ClaimId': null, 'ClaimDocument.Reference': reference, 'ClaimDocument.EligibilityId': eligibilityId, 'ClaimDocument.IsEnabled': true })
    .select('ClaimDocument.DocumentStatus', 'ClaimDocument.DocumentType', 'ClaimDocument.ClaimDocumentId', 'ClaimDocument.ClaimExpenseId')
    .orderBy('ClaimDocument.DateSubmitted', 'desc')
}
