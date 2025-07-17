const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = reference => {
  const db = getDatabaseConnector()

  return db.raw(
    'SELECT * FROM [IntSchema].[getHistoricClaimsByReference] (?) ORDER BY getHistoricClaimsByReference.DateSubmitted DESC',
    [reference],
  )
}
