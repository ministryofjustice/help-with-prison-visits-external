const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const insertFirstTimeClaim = require('../../../app/services/data/insert-first-time-claim')
const FirstTimeClaim = require('../../../app/services/domain/first-time-claim')
const claimStatusEnum = require('../../../app/constants/claim-status-enum')
const dateFormatter = require('../../../app/services/date-formatter')

const DAY = '01'
const MONTH = '11'
const YEAR = '2016'

module.exports.DATE_OF_JOURNEY = dateFormatter.build(DAY, MONTH, YEAR)
module.exports.DATE_CREATED = dateFormatter.now()
module.exports.DATE_SUBMITTED = dateFormatter.now()
module.exports.STATUS = claimStatusEnum.IN_PROGRESS
module.exports.CHILD_VISITOR = 'yes'

module.exports.build = function (reference) {
  return new FirstTimeClaim(reference, DAY, MONTH, YEAR, this.CHILD_VISITOR
  )
}

module.exports.insert = function (reference, eligibilityId) {
  return insertFirstTimeClaim(reference, eligibilityId, this.build(reference))
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
