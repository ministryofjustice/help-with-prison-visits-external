const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const childRelationshipEnum = require('../../../app/constants/child-relationship-enum')
const AboutChild = require('../../../app/services/domain/about-child')
const insertChild = require('../../../app/services/data/insert-child')
const dateFormatter = require('../../../app/services/date-formatter')

module.exports.FIRST_NAME = 'Joe'
module.exports.LAST_NAME = 'Bloggs'
module.exports.DAY = '15'
module.exports.MONTH = '05'
module.exports.YEAR = '2014'
module.exports.CHILD_RELATIONSHIP = childRelationshipEnum.PRISONER_CHILD
module.exports.DOB = dateFormatter.build(this.DAY, this.MONTH, this.YEAR)

module.exports.build = function () {
  return new AboutChild(
    this.FIRST_NAME,
    this.LAST_NAME,
    this.DAY,
    this.MONTH,
    this.YEAR,
    this.CHILD_RELATIONSHIP
  )
}

module.exports.insert = function (reference, eligibilityId, claimId) {
  return insertChild(reference, eligibilityId, claimId, this.build())
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('ExtSchema.ClaimChild')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex('ExtSchema.ClaimChild')
    .where('ClaimId', claimId)
    .del()
}
