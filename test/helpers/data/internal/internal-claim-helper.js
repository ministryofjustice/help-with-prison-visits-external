const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const claimStatusEnum = require('../../../../app/constants/claim-status-enum')
const dateFormatter = require('../../../../app/services/date-formatter')

const DAY = '01'
const MONTH = '11'
const YEAR = '2016'

module.exports.CLAIM_ID = Math.floor(Date.now() / 100) - 14000000000
module.exports.DATE_OF_JOURNEY = dateFormatter.build(DAY, MONTH, YEAR)
module.exports.DATE_CREATED = dateFormatter.now()
module.exports.DATE_SUBMITTED = dateFormatter.now()
module.exports.STATUS = claimStatusEnum.IN_PROGRESS

module.exports.insert = function (reference, eligibilityId) {
  console.log('reference: ' + reference)
  console.log('eligibilityId: ' + eligibilityId)

  return knex('IntSchema.Claim').insert({
    ClaimId: this.CLAIM_ID,
    EligibilityId: eligibilityId,
    Reference: reference,
    DateOfJourney: this.DATE_OF_JOURNEY.toDate(),
    DateCreated: this.DATE_CREATED.toDate(),
    DateSubmitted: this.DATE_SUBMITTED.toDate(),
    Status: claimStatusEnum.IN_PROGRESS
  }).returning('ClaimId')
  .then(function (insertedIds) {
    return insertedIds[0]
  })
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('IntSchema.Claim')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex('IntSchema.Claim')
    .where('ClaimId', claimId)
    .del()
}
