const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const FirstTimeClaim = require('../domain/first-time-claim')
const claimStatusEnum = require('../../constants/claim-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, claim) {
  if (!(claim instanceof FirstTimeClaim)) {
    throw new Error('Provided claim object is not an instance of the expected class')
  }
  return knex('Claim').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    DateOfJourney: claim.dateOfJourney.toDate(),
    DateCreated: dateFormatter.now().toDate(),
    DateSubmitted: null,
    Status: claimStatusEnum.IN_PROGRESS
  }).returning('ClaimId')
  .then(function (insertedIds) {
    return insertedIds[0]
  })
}
