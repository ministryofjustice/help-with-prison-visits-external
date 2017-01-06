const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const eligiblityStatusEnum = require('../../../app/constants/eligibility-status-enum')
const visitorHelper = require('./visitor-helper')
const prisonerHelper = require('./prisoner-helper')
const claimHelper = require('./claim-helper')
const dateFormatter = require('../../../app/services/date-formatter')

module.exports.DATE_CREATED = dateFormatter.now()
module.exports.DATE_SUBMITTED = dateFormatter.now()
module.exports.STATUS = eligiblityStatusEnum.IN_PROGRESS

module.exports.insert = function (reference) {
  return knex('ExtSchema.Eligibility')
    .insert({
      Reference: reference,
      DateCreated: this.DATE_CREATED.toDate(),
      DateSubmitted: this.DATE_SUBMITTED.toDate(),
      Status: this.STATUS
    })
    .returning('EligibilityId')
    .then(function (insertedIds) {
      return insertedIds[0]
    })
}

module.exports.insertEligibilityVisitorAndPrisoner = function (reference) {
  var eligibilityId

  return this.insert(reference)
    .then(function (newEligibilityId) {
      eligibilityId = newEligibilityId
      return visitorHelper.insert(reference, eligibilityId)
    })
    .then(function () {
      return prisonerHelper.insert(reference, eligibilityId)
    })
    .then(function () {
      return eligibilityId
    })
}

module.exports.insertEligibilityClaim = function (reference) {
  var eligibilityId

  return this.insert(reference)
    .then(function (newEligibilityId) {
      eligibilityId = newEligibilityId
      return claimHelper.insert(reference, newEligibilityId)
    })
    .then(function (newClaimId) {
      return { eligibilityId: eligibilityId, claimId: newClaimId }
    })
}

module.exports.get = function (reference) {
  return knex.first()
    .from('ExtSchema.Eligibility')
    .where('Reference', reference)
}

module.exports.delete = function (reference) {
  return deleteByReference('ExtSchema.Eligibility', reference)
}

function deleteByReference (schemaTable, reference) {
  return knex(schemaTable).where('Reference', reference).del()
}

module.exports.deleteAll = function (reference) {
  return deleteByReference('ExtSchema.Task', reference)
    .then(function () { return deleteByReference('ExtSchema.ClaimBankDetail', reference) })
    .then(function () { return deleteByReference('ExtSchema.ClaimDocument', reference) })
    .then(function () { return deleteByReference('ExtSchema.ClaimExpense', reference) })
    .then(function () { return deleteByReference('ExtSchema.ClaimChild', reference) })
    .then(function () { return deleteByReference('ExtSchema.ClaimEscort', reference) })
    .then(function () { return deleteByReference('ExtSchema.Claim', reference) })
    .then(function () { return deleteByReference('ExtSchema.Visitor', reference) })
    .then(function () { return deleteByReference('ExtSchema.Prisoner', reference) })
    .then(function () { return deleteByReference('ExtSchema.Eligibility', reference) })
}
