const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const eligiblityStatusEnum = require('../../../app/constants/eligibility-status-enum')
const visitorHelper = require('./visitor-helper')
const prisonerHelper = require('./prisoner-helper')
const dateFormatter = require('../../../app/services/date-formatter')

module.exports.DATE_CREATED = dateFormatter.now().toDate()
module.exports.DATE_SUBMITTED = dateFormatter.now().toDate()
module.exports.STATUS = eligiblityStatusEnum.IN_PROGRESS

module.exports.insert = function (reference) {
  return knex('ExtSchema.Eligibility')
    .insert({
      Reference: reference,
      DateCreated: this.DATE_CREATED,
      DateSubmitted: this.DATE_SUBMITTED,
      Status: this.STATUS
    })
}

module.exports.insertEligibilityVisitorAndPrisoner = function (reference) {
  return this.insert(reference)
    .then(function () {
      return visitorHelper.insert(reference)
    })
    .then(function () {
      return prisonerHelper.insert(reference)
    })
}

module.exports.get = function (reference) {
  return knex.first()
    .from('ExtSchema.Eligibility')
    .where('Reference', reference)
}

module.exports.delete = function (reference) {
  return knex('ExtSchema.Eligibility')
    .where('Reference', reference)
    .del()
}

module.exports.deleteEligibilityVisitorAndPrisoner = function (reference) {
  var self = this
  return prisonerHelper.delete(reference)
    .then(function () {
      return visitorHelper.delete(reference)
    })
    .then(function () {
      return self.delete(reference)
    })
}
