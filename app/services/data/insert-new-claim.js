const { getDatabaseConnector } = require('../../databaseConnector')
const NewClaim = require('../domain/new-claim')
const claimStatusEnum = require('../../constants/claim-status-enum')
const dateFormatter = require('../date-formatter')

module.exports = function (reference, eligibilityId, claimType, claim) {
  if (!(claim instanceof NewClaim)) {
    throw new Error('Provided claim object is not an instance of the expected class')
  }

  const db = getDatabaseConnector()

  return db('Claim').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimType: claimType,
    IsAdvanceClaim: claim.isAdvanceClaim,
    DateOfJourney: claim.dateOfJourney.format('YYYY-MM-DD'),
    DateCreated: dateFormatter.now().toDate(),
    DateSubmitted: null,
    Status: claimStatusEnum.IN_PROGRESS
  }).returning('ClaimId')
    .then(function (insertedIds) {
      return insertedIds[0]
    })
}
