const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const getRepeatEligibility = require('./get-repeat-eligibility')
const claimTypeEnum = require('../../constants/claim-type-enum')

module.exports = function (reference, claimId, claimType) {
  return knex('Claim')
    .where({'Reference': reference, 'ClaimId': claimId})
    .first('EligibilityId')
    .then(function (claim) {
      if (claimType === claimTypeEnum.REPEAT_CLAIM || claimType === claimTypeEnum.REPEAT_DUPLICATE) {
        return getRepeatEligibility(reference, null, claim.EligibilityId)
      } else {
        return knex('Visitor')
          .where({'Reference': reference, 'EligibilityId': claim.EligibilityId})
          .first('HouseNumberAndStreet', 'Town', 'PostCode')
      }
    })
}
