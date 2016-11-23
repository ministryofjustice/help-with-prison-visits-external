const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const insertEligibilityVisitorUpdatedContactDetail = require('../../../app/services/data/insert-eligibility-visitor-updated-contact-detail')
const UpdateContactDetails = require('../../../app/services/domain/updated-contact-details')

module.exports.EMAIL_ADDRESS = 'donotsend@apvs.com'
module.exports.PHONE_NUMBER = '02153245564'

module.exports.build = function () {
  return new UpdateContactDetails(
    this.EMAIL_ADDRESS,
    this.PHONE_NUMBER)
}

module.exports.insert = function (reference, eligibilityId) {
  return insertEligibilityVisitorUpdatedContactDetail(reference, eligibilityId, this.build())
}

module.exports.get = function (reference) {
  return knex.first()
    .from('ExtSchema.EligibilityVisitorUpdateContactDetail')
    .where('Reference', reference)
}

module.exports.delete = function (reference) {
  return knex('ExtSchema.EligibilityVisitorUpdateContactDetail')
    .where('Reference', reference)
    .del()
}
