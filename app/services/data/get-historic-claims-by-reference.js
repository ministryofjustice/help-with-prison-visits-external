const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference) {
  return knex.raw('SELECT * FROM [IntSchema].[getHistoricClaimsByReference] (?) ORDER BY getHistoricClaimsByReference.DateSubmitted DESC', [reference])
}
