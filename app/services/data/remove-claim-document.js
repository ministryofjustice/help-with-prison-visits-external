const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (claimId, claimDocumentDetails) {
  var claimExpenseId
  if (claimDocumentDetails.claimExpenseId) {
    claimExpenseId = claimDocumentDetails.claimExpenseId
  } else {
    claimExpenseId = null
  }
  return knex('ClaimDocument').where({'DocumentType': claimDocumentDetails.documentType, 'ClaimId': claimId, 'ClaimExpenseId': claimExpenseId})
    .update({
      'IsEnabled': false
    })
}
