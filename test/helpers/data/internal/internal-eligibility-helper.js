const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const claimHelper = require('./internal-claim-helper')
const claimChildHelper = require('./internal-claim-child-helper')
const claimExpenseHelper = require('./internal-claim-expense-helper')
const visitorHelper = require('./internal-visitor-helper')
const prisonerHelper = require('./internal-prisoner-helper')
const dateFormatter = require('../../../../app/services/date-formatter')

module.exports.ELIGIBILITY_ID = Math.floor(Date.now() / 100) - 14000000000
module.exports.DATE_CREATED = dateFormatter.now()
module.exports.DATE_SUBMITTED = dateFormatter.now()
module.exports.STATUS = 'APPROVED'

module.exports.insert = function (reference) {
  return knex('IntSchema.Eligibility')
    .insert({
      EligibilityId: this.ELIGIBILITY_ID,
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

module.exports.insertEligibilityAndClaim = function (reference) {
  var eligibilityId
  var claimId

  return this.insert(reference)
    .then(function (id) { eligibilityId = id })
    .then(function () { return visitorHelper.insert(reference, eligibilityId) })
    .then(function () { return prisonerHelper.insert(reference, eligibilityId) })
    .then(function () { return claimHelper.insert(reference, eligibilityId) })
    .then(function (newClaimId) { claimId = newClaimId })
    .then(function () { return claimChildHelper.insert(reference, eligibilityId, claimId) })
    .then(function () { return claimExpenseHelper.insert(reference, eligibilityId, claimId) })
    .then(function () { return { eligibilityId: eligibilityId, claimId: claimId } })
}

module.exports.get = function (reference) {
  return knex.first()
    .from('IntSchema.Eligibility')
    .where('Reference', reference)
}

module.exports.delete = function (reference) {
  return deleteByReference('IntSchema.Eligibility', reference)
}

function deleteByReference (schemaTable, reference) {
  return knex(schemaTable).where('Reference', reference).del()
}

module.exports.deleteAll = function (reference) {
  return deleteByReference('IntSchema.ClaimExpense', reference)
    .then(function () { return deleteByReference('IntSchema.ClaimChild', reference) })
    .then(function () { return deleteByReference('IntSchema.Claim', reference) })
    .then(function () { return deleteByReference('IntSchema.Visitor', reference) })
    .then(function () { return deleteByReference('IntSchema.Prisoner', reference) })
    .then(function () { return deleteByReference('IntSchema.Eligibility', reference) })
}
