const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, claimId) {
  return knex.raw(`SELECT * FROM [IntSchema].[getClaimDocumentsHistoricClaim] (?, ?)`, [ reference, claimId ])
}
