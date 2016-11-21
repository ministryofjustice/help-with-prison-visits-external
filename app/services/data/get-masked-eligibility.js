const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, dob) {
  return knex.raw(`SELECT * FROM [IntSchema].[getMaskedEligibility] (?, ?)`, [ reference, dob ])
    .then(function (result) {
      if (result && result.length > 0) {
        return result[0]
      } else {
        throw new Error('Could not find any valid Eligibility details')
      }
    })
}
