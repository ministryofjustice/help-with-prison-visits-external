const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibiltyId, claimId) {
  console.log('ClaimId in getClaimEscortByIdOrLastApproved: ' + claimId)
  return knex.raw(`SELECT * FROM [IntSchema].[getClaimEscortByIdOrLastApproved] (?, ?, ?)`, [ reference, eligibiltyId, claimId ])
}
