const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (claimId, claimDocumentId) => {
  const db = getDatabaseConnector()

  return db('ClaimDocument').where({ ClaimId: claimId, ClaimDocumentId: claimDocumentId }).first('Filepath')
}
