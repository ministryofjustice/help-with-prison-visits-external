const Promise = require('bluebird')
const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const insertNewClaim = require('./insert-new-claim')
const getLastClaimDetails = require('./get-last-claim-details')

module.exports = function (reference, eligibilityId, claim) {
  var claimId
  var lastClaimDetails

  return insertNewClaim(reference, eligibilityId, claim)
    .then(function (newClaimId) { claimId = newClaimId })
    .then(function () { return getLastClaimDetails(reference, eligibilityId) })
    .then(function (claimDetails) { lastClaimDetails = claimDetails })
    .then(function () { return insertClaimDetail('ClaimChild', reference, eligibilityId, claimId, lastClaimDetails.children) })
    .then(function () { return insertClaimDetail('ClaimExpense', reference, eligibilityId, claimId, lastClaimDetails.expenses) })
    .then(function () { return claimId })
}

function insertClaimDetail (tableName, reference, eligibilityId, claimId, objects) {
  if (objects && objects.length > 0) {
    objects.forEach(function (object) {
      object.Reference = reference
      object.EligibilityId = eligibilityId
      object.ClaimId = claimId
      object.IsEnabled = true
    })

    return knex(tableName).insert(objects)
  } else {
    return Promise.resolve()
  }
}
