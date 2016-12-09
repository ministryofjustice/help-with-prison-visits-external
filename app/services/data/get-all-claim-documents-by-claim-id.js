const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (claimId) {
  return knex('ClaimDocument')
    .where({'ClaimDocument.ClaimId': claimId, 'ClaimDocument.IsEnabled': true})
    .select('ClaimDocument.DocumentStatus', 'ClaimDocument.DocumentType', 'ClaimDocument.ClaimDocumentId', 'ClaimDocument.ClaimExpenseId')
    .orderBy('ClaimDocument.DateSubmitted', 'desc')
}
