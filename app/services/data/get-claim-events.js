const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (reference, claimId) => {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getClaimEvents] (?, ?) ORDER BY DateAdded ASC', [reference, claimId])
}
