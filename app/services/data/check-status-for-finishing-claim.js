const { getDatabaseConnector } = require('../../databaseConnector')
const claimStatusEnum = require('../../constants/claim-status-enum')

module.exports = (reference, eligibilityId, claimId) => {
  const db = getDatabaseConnector()

  return db('Claim')
    .where({
      Reference: reference,
      EligibilityId: eligibilityId,
      ClaimId: claimId,
      Status: claimStatusEnum.IN_PROGRESS,
    })
    .first('ClaimId')
    .then(matchingClaimId => !!matchingClaimId)
}
