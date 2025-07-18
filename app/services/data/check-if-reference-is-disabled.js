const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = reference => {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[checkForDisabledReference] (?)', [reference]).then(results => {
    if (results.length > 0) {
      return true
    }
    return false
  })
}
