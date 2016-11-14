const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const fs = require('fs')

module.exports = function (claimId, claimDocumentDetails) {
  var claimExpenseId
  if (claimDocumentDetails.claimExpenseId) {
    claimExpenseId = claimDocumentDetails.claimExpenseId
  } else {
    claimExpenseId = null
  }
  return knex('ClaimDocument')
    .returning('Filepath')
    .where({'DocumentType': claimDocumentDetails.documentType, 'ClaimId': claimId, 'ClaimExpenseId': claimExpenseId, 'IsEnabled': true})
    .update({
      'IsEnabled': false
    })
    .then(function (filepath) {
      console.log(filepath)
      filepath.forEach(function (path) {
        if (path) {
          fs.unlinkSync(path)
        }
      })
    })
}
