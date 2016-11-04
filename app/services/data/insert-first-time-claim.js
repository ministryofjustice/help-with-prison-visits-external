const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const moment = require('moment')
const FirstTimeClaim = require('../domain/first-time-claim')
const claimStatusEnum = require('../../constants/claim-status-enum')

module.exports = function (claim) {
  if (!(claim instanceof FirstTimeClaim)) {
    throw new Error('Provided claim object is not an instance of the expected class')
  }
  return knex('Claim').insert({
    Reference: claim.reference,
    DateOfJourney: claim.dateOfJourney,
    DateCreated: moment().toDate(),
    DateSubmitted: null,
    Status: claimStatusEnum.IN_PROGRESS
  }).returning('ClaimId')
  .then(function (insertedIds) {
    return insertedIds[0]
  })
}
