const { getDatabaseConnector } = require('../../databaseConnector')
const AWSHelper = require('../aws-helper')

const aws = new AWSHelper()

module.exports = (claimId, claimDocumentId) => {
  const db = getDatabaseConnector()

  return db('ClaimDocument')
    .returning('Filepath')
    .where({ ClaimId: claimId, ClaimDocumentId: claimDocumentId })
    .update({
      IsEnabled: false,
    })
    .then(async filePath => {
      if (filePath[0]?.Filepath) {
        await aws.delete(filePath[0].Filepath)
      }
    })
}
