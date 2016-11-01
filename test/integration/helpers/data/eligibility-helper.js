const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const eligiblityEnum = require('../../../../app/constants/eligibility-status-enum')

module.exports.REFERENCE = 'V123456'
module.exports.DATE_CREATED = moment().toDate()
module.exports.DATE_SUBMITTED = moment().toDate()
module.exports.STATUS = eligiblityEnum.IN_PROGRESS
module.exports.BENEFIT = 'yes' // TODO: Replace with a benefit enum.

module.exports.insert = function () {
  return knex('ExtSchema.Eligibility')
    .insert({
      Reference: this.REFERENCE,
      DateCreated: this.DATE_CREATED,
      DateSubmitted: this.DATE_SUBMITTED,
      Status: this.REFERENCE,
      Benefit: this.BENEFIT
    })
}

module.exports.delete = function () {
  return knex('ExtSchema.Eligibility')
    .where('Reference', this.REFERENCE)
    .del()
}
