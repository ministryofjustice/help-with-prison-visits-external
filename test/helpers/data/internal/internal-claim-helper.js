const { getDatabaseConnector } = require('../../../../app/databaseConnector')
const dateFormatter = require('../../../../app/services/date-formatter')

const DAY = '01'
const MONTH = '11'
const YEAR = '2016'

module.exports.CLAIM_ID = Math.floor(Date.now() / 100) - 15000000000
module.exports.CLAIM_TYPE = 'first-time'
module.exports.IS_ADVANCE_CLAIM = false
module.exports.DATE_OF_JOURNEY = dateFormatter.build(DAY, MONTH, YEAR)
module.exports.DATE_CREATED = dateFormatter.now()
module.exports.DATE_SUBMITTED = dateFormatter.now()
module.exports.DATE_REVIEWED = dateFormatter.now()
module.exports.STATUS = 'APPROVED'
module.exports.REASON = null
module.exports.NOTE = null

module.exports.build = function () {
  return {
    ClaimId: this.CLAIM_ID,
    ClaimType: this.CLAIM_TYPE,
    IsAdvanceClaim: this.IS_ADVANCE_CLAIM,
    DateOfJourney: this.DATE_OF_JOURNEY.toDate(),
    DateCreated: this.DATE_CREATED.toDate(),
    DateSubmitted: this.DATE_SUBMITTED.toDate(),
    DateReviewed: this.DATE_REVIEWED.toDate(),
    Status: this.STATUS,
    Reason: this.REASON,
    Note: this.NOTE
  }
}

module.exports.insert = function (reference, eligibilityId, data, status) {
  const claim = data || this.build()
  const db = getDatabaseConnector()
  if (status) {
    claim.Status = status
  }
  return db('IntSchema.Claim').insert({
    ClaimId: claim.ClaimId,
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimType: claim.ClaimType,
    IsAdvanceClaim: claim.IsAdvanceClaim,
    DateOfJourney: claim.DateOfJourney,
    DateCreated: claim.DateCreated,
    DateSubmitted: claim.DateSubmitted,
    DateReviewed: claim.DateReviewed,
    Status: claim.Status,
    Reason: claim.Reason,
    Note: claim.Note
  }).returning('ClaimId')
    .then(function (insertedIds) {
      return insertedIds[0].ClaimId
    })
}

module.exports.get = function (claimId) {
  const db = getDatabaseConnector()

  return db.first()
    .from('IntSchema.Claim')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  const db = getDatabaseConnector()

  return db('IntSchema.Claim')
    .where('ClaimId', claimId)
    .del()
}
