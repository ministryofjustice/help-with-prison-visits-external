const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (claimDocumentId) {
  const db = getDatabaseConnector()

  return db('ClaimDocument')
    .where('ClaimDocument.ClaimDocumentId', claimDocumentId)
    .first('ClaimDocument.Filepath')
}
