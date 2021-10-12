const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (reference, eligibilityId, claimId) {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getClaimDocumentsHistoricClaim] (?, ?, ?)', [reference, eligibilityId, claimId])
}
