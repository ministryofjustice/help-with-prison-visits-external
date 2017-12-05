const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, dob) {
  return knex.raw(`SELECT * FROM [IntSchema].[getHistoricClaimIds] (?, ?) ORDER BY getHistoricClaimIds.DateSubmitted DESC`, [ reference, dob ])
}
