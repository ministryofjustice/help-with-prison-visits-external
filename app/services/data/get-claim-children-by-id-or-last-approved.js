const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (reference, eligibiltyId, claimId) {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getClaimChildrenByIdOrLastApproved] (?, ?, ?)', [reference, eligibiltyId, claimId])
}
