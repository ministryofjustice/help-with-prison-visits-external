const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (claimId) {
  return knex('Claim')
    .where('ClaimId', claimId)
    .first('IsAdvanceClaim')
    .then(function (result) {
      return result.IsAdvanceClaim
    })
}
