const { getDatabaseConnector } = require('../../databaseConnector')
const getRepeatEligibility = require('./get-repeat-eligibility')
const claimTypeEnum = require('../../constants/claim-type-enum')

module.exports = function (reference, claimId, claimType) {
  const db = getDatabaseConnector()

  return db('Claim')
    .where({ Reference: reference, ClaimId: claimId })
    .first('EligibilityId')
    .then(function (claim) {
      if (claimType === claimTypeEnum.REPEAT_CLAIM || claimType === claimTypeEnum.REPEAT_DUPLICATE) {
        return getRepeatEligibility(reference, null, claim.EligibilityId)
      } else {
        return db('Visitor')
          .where({ Reference: reference, EligibilityId: claim.EligibilityId })
          .first('HouseNumberAndStreet', 'Town', 'PostCode', 'DateOfBirth', 'Benefit', 'Relationship')
      }
    })
}
