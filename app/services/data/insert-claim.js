const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const Claim = require('../domain/claim')

module.exports = function (claim) {
  if (!(claim instanceof Claim)) {
    throw new Error('Provided claim object is not an instance of the expected class')
  }
  return knex('Claim').insert({
    Reference: claim.reference,
    DateOfJourney: claim.dateOfJourney.toDate(),
    DateCreated: claim.dateCreated.toDate(),
    DateSubmitted: null,
    Status: claim.status
  }).returning('ClaimId')
}
