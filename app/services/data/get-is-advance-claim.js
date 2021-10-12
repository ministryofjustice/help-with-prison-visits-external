const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (claimId) {
  const db = getDatabaseConnector()

  return db('Claim')
    .where('ClaimId', claimId)
    .first('IsAdvanceClaim')
    .then(function (result) {
      return result.IsAdvanceClaim
    })
}
