const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

// TODO: Add test for this query.
module.exports = function (claimId) {
  return knex('Claim')
    .where('ClaimId', claimId)
    .first('IsAdvanceClaim')
}
