const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibiltyId, claimId) {
  return knex.raw(`SELECT * FROM [IntSchema].[getClaimEscortByIdOrLastApproved] (?, ?, ?)`, [ reference, eligibiltyId, claimId ])
}
