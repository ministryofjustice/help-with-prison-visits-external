const knexConfig = require('../../../knexfile').extweb
const knex = require('knex')(knexConfig)
const { AWSHelper } = require('../aws-helper')
const aws = new AWSHelper()

module.exports = function (claimDocumentId) {
  return knex('ClaimDocument')
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
