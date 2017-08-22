const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const insertVisitor = require('../../../app/services/data/insert-visitor')
const AboutYou = require('../../../app/services/domain/about-you')

module.exports.FIRST_NAME = 'John'
module.exports.LAST_NAME = 'Smith'
module.exports.NATIONAL_INSURANCE_NUMBER = 'BN180518D'
module.exports.HOUSE_NUMBER_AND_STREET = '123 Street'
module.exports.TOWN = 'Belfast'
module.exports.COUNTY = 'Antrim'
module.exports.POST_CODE = 'BT137RT'
module.exports.COUNTRY = 'United Kingdom'
module.exports.EMAIL_ADDRESS = 'donotsend@apvs.com'
module.exports.PHONE_NUMBER = '02153245564'
module.exports.DATE_OF_BIRTH = '1990-01-01'
module.exports.RELATIONSHIP = 'partner'
module.exports.JOURNEY_ASSISTANCE = 'yes'
module.exports.REQURE_BENEFIT_UPLOAD = false
module.exports.BENEFIT = 'income-support'

module.exports.build = function () {
  return new AboutYou(
    this.DATE_OF_BIRTH,
    this.RELATIONSHIP,
    this.BENEFIT,
    this.FIRST_NAME,
    this.LAST_NAME,
    this.NATIONAL_INSURANCE_NUMBER,
    this.HOUSE_NUMBER_AND_STREET,
    this.TOWN,
    this.COUNTY,
    this.POST_CODE,
    this.COUNTRY,
    this.EMAIL_ADDRESS,
    this.PHONE_NUMBER)
}

module.exports.insert = function (reference, eligibilityId) {
  return insertVisitor(reference, eligibilityId, this.build())
}

module.exports.get = function (reference) {
  return knex.first()
    .from('ExtSchema.Visitor')
    .where('Reference', reference)
}

module.exports.delete = function (reference) {
  return knex('ExtSchema.Visitor')
    .where('Reference', reference)
    .del()
}
