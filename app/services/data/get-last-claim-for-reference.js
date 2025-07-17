const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (reference, eligibiltyId) => {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getLastClaimForReference] (?, ?)', [reference, eligibiltyId])
}
