const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const insertEligibleChild = require('../../../app/services/data/insert-eligible-child')
const EligibleChild = require('../../../app/services/domain/eligible-child')

module.exports.FIRST_NAME = 'John'
module.exports.LAST_NAME = 'Smith'
module.exports.CHILD_RELATIONSHIP = 'father'
module.exports.DOB_DAY = '01'
module.exports.DOB_MONTH = '01'
module.exports.DOB_YEAR = '2010'
module.exports.PARENT_FIRST_NAME = 'Jane'
module.exports.PARENT_LAST_NAME = 'Smith'
module.exports.HOUSE_NUMBER_AND_STREET = '123 Street'
module.exports.TOWN = 'Belfast'
module.exports.COUNTY = 'Antrim'
module.exports.POST_CODE = 'BT137RT'
module.exports.COUNTRY = 'United Kingdom'

module.exports.build = function () {
  return new EligibleChild(
    this.FIRST_NAME,
    this.LAST_NAME,
    this.CHILD_RELATIONSHIP,
    this.DOB_DAY,
    this.DOB_MONTH,
    this.DOB_YEAR,
    this.PARENT_FIRST_NAME,
    this.PARENT_LAST_NAME,
    this.HOUSE_NUMBER_AND_STREET,
    this.TOWN,
    this.COUNTY,
    this.POST_CODE,
    this.COUNTRY)
}

module.exports.insert = function (reference, eligibilityId) {
  return insertEligibleChild(this.build(), reference, eligibilityId)
}

module.exports.get = function (reference) {
  return knex.first()
    .from('ExtSchema.EligibleChild')
    .where('Reference', reference)
}

module.exports.delete = function (reference) {
  return knex('ExtSchema.EligibleChild')
    .where('Reference', reference)
    .del()
}
