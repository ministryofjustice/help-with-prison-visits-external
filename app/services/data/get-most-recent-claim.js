const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibiltyId) {
  return knex.raw(`SELECT * FROM [IntSchema].[getMostRecentClaim] (?, ?)`, [ reference, eligibiltyId ])
}
