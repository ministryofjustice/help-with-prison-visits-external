const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const AboutEscort = require('../../../app/services/domain/about-escort')
const insertEscort = require('../../../app/services/data/insert-escort')
const dateFormatter = require('../../../app/services/date-formatter')

module.exports.FIRST_NAME = 'John'
module.exports.LAST_NAME = 'SMITH'
module.exports.DAY = '15'
module.exports.MONTH = '05'
module.exports.YEAR = '1984'
module.exports.NATIONAL_INSURANCE_NUMBER = 'AE192018C'
module.exports.DOB = dateFormatter.build(this.DAY, this.MONTH, this.YEAR)

module.exports.build = function () {
  return new AboutEscort(
    this.FIRST_NAME,
    this.LAST_NAME,
    this.DAY,
    this.MONTH,
    this.YEAR,
    this.NATIONAL_INSURANCE_NUMBER
  )
}

module.exports.insert = function (reference, eligibilityId, claimId) {
  return insertEscort(reference, eligibilityId, claimId, this.build())
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('ExtSchema.ClaimEscort')
    .where({'ClaimId': claimId, 'IsEnabled': true})
}

module.exports.delete = function (claimId) {
  return knex('ExtSchema.ClaimEscort')
    .where('ClaimId', claimId)
    .del()
}
