const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (eligibilityId) {
  return knex.raw(`SELECT * FROM [IntSchema].[getPrisonerReleaseDate] (?)`, [eligibilityId])
}
