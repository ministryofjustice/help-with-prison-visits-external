const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (claimId, claimDocumentId) => {
  const db = getDatabaseConnector()

  return db('ClaimDocument')
    .where('ClaimDocument.ClaimDocumentId', claimDocumentId)
    .where('ClaimDocument.ClaimId', claimId)
    .first('ClaimDocument.Filepath')
}
