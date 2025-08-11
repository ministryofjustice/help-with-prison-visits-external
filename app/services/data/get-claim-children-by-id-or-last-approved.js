const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (reference, eligibiltyId, claimId) => {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getClaimChildrenByIdOrLastApproved] (?, ?, ?)', [
    reference,
    eligibiltyId,
    claimId,
  ])
}
