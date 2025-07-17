const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (reference, dob, claimId) => {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getHistoricClaims] (?, ?) WHERE getHistoricClaims.ClaimId = (?)', [
    reference,
    dob,
    claimId,
  ])
}
