const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, dob, claimId) {
  return knex.raw(`SELECT * FROM [IntSchema].[getHistoricClaims] (?, ?) WHERE getHistoricClaims.ClaimId = (?)`, [ reference, dob, claimId ])
}
