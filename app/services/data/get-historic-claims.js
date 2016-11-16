const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (claimId, dob) {
  return knex.raw(`SELECT * FROM [IntSchema].[getHistoricClaims] (?, ?)`, [ claimId, dob ])
}
