const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = claimId => {
  const db = getDatabaseConnector()

  return db('Claim')
    .where('ClaimId', claimId)
    .first('IsAdvanceClaim')
    .then(result => {
      return result.IsAdvanceClaim
    })
}
