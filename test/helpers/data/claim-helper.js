const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const insertFirstTimeClaim = require('../../../app/services/data/insert-first-time-claim')
const FirstTimeClaim = require('../../../app/services/domain/first-time-claim')
const claimStatusEnum = require('../../../app/constants/claim-status-enum')

const DAY = '01'
const MONTH = '11'
const YEAR = '2016'

module.exports.DATE_OF_JOURNEY = moment(`${YEAR}-${MONTH}-${DAY}`).toDate()
module.exports.DATE_CREATED = moment().toDate()
module.exports.DATE_SUBMITTED = moment().toDate()
module.exports.STATUS = claimStatusEnum.IN_PROGRESS

module.exports.build = function (reference) {
  return new FirstTimeClaim(
    reference,
    DAY,
    MONTH,
    YEAR
  )
}

module.exports.insert = function (reference) {
  return insertFirstTimeClaim(this.build(reference))
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('ExtSchema.Claim')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex('ExtSchema.Claim')
    .where('ClaimId', claimId)
    .del()
}
