const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const eligiblityStatusEnum = require('../../../app/constants/eligibility-status-enum')
const visitorHelper = require('./visitor-helper')
const prisonerHelper = require('./prisoner-helper')

module.exports.REFERENCE = 'V123467'
module.exports.DATE_CREATED = moment().toDate()
module.exports.DATE_SUBMITTED = moment().toDate()
module.exports.STATUS = eligiblityStatusEnum.IN_PROGRESS

module.exports.insert = function () {
  return knex('ExtSchema.Eligibility')
    .insert({
      Reference: this.REFERENCE,
      DateCreated: this.DATE_CREATED,
      DateSubmitted: this.DATE_SUBMITTED,
      Status: this.REFERENCE
    })
}

module.exports.insertEligibilityVisitorAndPrisoner = function () {
  var self = this
  return this.insert()
    .then(function () {
      return visitorHelper.insert(self.REFERENCE)
    })
    .then(function () {
      return prisonerHelper.insert(self.REFERENCE)
    })
}

module.exports.get = function (reference) {
  return knex.select()
    .from('ExtSchema.Eligibility')
    .where('Reference', reference)
}

module.exports.delete = function () {
  return knex('ExtSchema.Eligibility')
    .where('Reference', this.REFERENCE)
    .del()
}

module.exports.deleteEligibilityVisitorAndPrisoner = function () {
  var self = this
  return prisonerHelper.delete(self.REFERENCE)
    .then(function () {
      return visitorHelper.delete(self.REFERENCE)
    })
    .then(function () {
      return self.delete()
    })
}
