const { getDatabaseConnector } = require('../../databaseConnector')
const claimStatusEnum = require('../../constants/claim-status-enum')

module.exports = function (reference, eligibilityId, claimId) {
  const db = getDatabaseConnector()

  return db('Claim')
    .where({ Reference: reference, EligibilityId: eligibilityId, ClaimId: claimId, Status: claimStatusEnum.IN_PROGRESS })
    .first('ClaimId')
    .then(function (claimId) {
      if (!claimId) {
        return false
      }
      return true
    })
}
