const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (claimDocumentId) {
  return knex('ClaimDocument')
    .where('ClaimDocument.ClaimDocumentId', claimDocumentId)
    .first('ClaimDocument.Filepath')
}
