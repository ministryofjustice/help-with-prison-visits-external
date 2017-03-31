const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const claimStatusEnum = require('../../constants/claim-status-enum')

module.exports = function (reference, eligibilityId, claimId) {
  return knex('Claim')
    .where({'Reference': reference, 'EligibilityId': eligibilityId, 'ClaimId': claimId, 'Status': claimStatusEnum.IN_PROGRESS})
    .first('ClaimId')
    .then(function (claimId) {
      if (!claimId) {
        return false
      }
      return true
    })
}
