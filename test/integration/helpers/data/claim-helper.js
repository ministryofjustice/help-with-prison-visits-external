const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const claimStatusEnum = require('../../../../app/constants/claim-status-enum')

module.exports.DATE_OF_JOURNEY = moment().toDate()
module.exports.DATE_CREATED = moment().toDate()
module.exports.DATE_SUBMITTED = moment().toDate()
module.exports.STATUS = claimStatusEnum.IN_PROGRESS

module.exports.insert = function (reference) {
  return knex('ExtSchema.Claim')
    .insert({
      Reference: reference,
      DateOfJourney: this.DATE_OF_JOURNEY,
      DateCreated: this.DATE_CREATED,
      DateSubmitted: this.DATE_SUBMITTED,
      Status: this.STATUS
    })
    .returning('ClaimId')
    .then(function (claimId) {
      module.exports.CLAIM_ID = claimId[0]
    })
}

module.exports.get = function (claimId) {
  return knex.select()
    .from('ExtSchema.Claim')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex('ExtSchema.Claim')
    .where('ClaimId', claimId)
    .del()
}
