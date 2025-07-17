const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = eligibilityId => {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getPrisonerReleaseDate] (?)', [eligibilityId])
}
