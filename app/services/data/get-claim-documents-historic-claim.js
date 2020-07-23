const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibilityId, claimId) {
  return knex.raw('SELECT * FROM [IntSchema].[getClaimDocumentsHistoricClaim] (?, ?, ?)', [reference, eligibilityId, claimId])
}
