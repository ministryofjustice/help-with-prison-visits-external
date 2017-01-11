const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const claimHelper = require('./internal-claim-helper')
const claimChildHelper = require('./internal-claim-child-helper')
const claimExpenseHelper = require('./internal-claim-expense-helper')
const claimEventHelper = require('./internal-claim-event-helper')
const visitorHelper = require('./internal-visitor-helper')
const prisonerHelper = require('./internal-prisoner-helper')
const claimDocumentHelper = require('./internal-claim-document-helper')
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

module.exports.insertEligibilityAndClaim = function (reference, status) {
  var eligibilityId
  var claimId

  return this.insert(reference)
    .then(function (id) { eligibilityId = id })
    .then(function () { return visitorHelper.insert(reference, eligibilityId) })
    .then(function () { return prisonerHelper.insert(reference, eligibilityId) })
    .then(function () { return claimHelper.insert(reference, eligibilityId, undefined, status) })
    .then(function (newClaimId) { claimId = newClaimId })
    .then(function () { return claimChildHelper.insert(reference, eligibilityId, claimId) })
    .then(function () { return claimExpenseHelper.insert(reference, eligibilityId, claimId) })
    .then(function () { return claimDocumentHelper.insert(reference, eligibilityId, claimId, undefined, claimExpenseHelper.CLAIM_EXPENSE_ID) })
    .then(function () { return claimEventHelper.insert(reference, eligibilityId, claimId) })
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

module.exports.deleteAll = function (schema, reference) {
  return deleteByReference('IntSchema.ClaimDocument', reference)
    .then(function () { return deleteByReference(`${schema}.ClaimExpense`, reference) })
    .then(function () { return deleteByReference(`${schema}.ClaimEvent`, reference) })
    .then(function () { return deleteByReference(`${schema}.ClaimChild`, reference) })
    .then(function () { return deleteByReference(`${schema}.Claim`, reference) })
    .then(function () { return deleteByReference(`${schema}.Visitor`, reference) })
    .then(function () { return deleteByReference(`${schema}.Prisoner`, reference) })
    .then(function () { return deleteByReference(`${schema}.Eligibility`, reference) })
}

module.exports.deleteAllExternal = function (reference) {
  this.deleteAll('ExtSchema', reference)
}

module.exports.deleteAllInternal = function (reference) {
  this.deleteAll('IntSchema', reference)
}
