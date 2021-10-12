const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (claimId, eligibilityId, reference) {
  const result = {}
  return getAnyClaimChildren(claimId, eligibilityId, reference)
    .then(function (child) {
      result.child = child.length !== 0
      return getAnyClaimEscorts(claimId, eligibilityId, reference)
    })
    .then(function (escort) {
      result.escort = escort.length !== 0
      return getAnyEligibleChildren(eligibilityId, reference)
        .then(function (eligibleChildren) {
          result.eligibleChildren = eligibleChildren.length !== 0
          return result
        })
    })
}

function getAnyClaimChildren (claimId, eligibilityId, reference) {
  const db = getDatabaseConnector()

  return db('ClaimChild')
    .where({
      ClaimId: claimId,
      EligibilityId: eligibilityId,
      Reference: reference,
      IsEnabled: true
    })
    .select('ClaimChildId')
}

function getAnyClaimEscorts (claimId, eligibilityId, reference) {
  const db = getDatabaseConnector()

  return db('ClaimEscort')
    .where({
      ClaimId: claimId,
      EligibilityId: eligibilityId,
      Reference: reference,
      IsEnabled: true
    })
    .select('ClaimEscortId')
}

function getAnyEligibleChildren (eligibilityId, reference) {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getEligibleChildren] (?, ?)', [reference, eligibilityId])
}
