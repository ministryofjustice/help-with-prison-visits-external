const { getDatabaseConnector } = require('../../databaseConnector')
const { AWSHelper } = require('../aws-helper')
const aws = new AWSHelper()

module.exports = function (claimDocumentId) {
  const db = getDatabaseConnector()

  return db('ClaimDocument')
    .returning('Filepath')
    .where('ClaimDocumentId', claimDocumentId)
    .update({
      IsEnabled: false
    })
    .then(async function (filepath) {
      if (filepath[0]) {
        await aws.delete(filepath[0])
      }
    })
}
