const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (claimId) {
  return knex.raw('SELECT * FROM [IntSchema].[getClaims] (?)', [claimId])
}
