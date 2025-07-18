const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (reference, dob) => {
  const db = getDatabaseConnector()

  return db.raw(
    'SELECT * FROM [IntSchema].[getHistoricClaimIds] (?, ?) ORDER BY getHistoricClaimIds.DateSubmitted DESC',
    [reference, dob],
  )
}
