const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (reference) {
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[checkForDisabledReference] (?)', [reference])
    .then(function (results) {
      if (results.length > 0) {
        return true
      } else {
        return false
      }
    })
}
