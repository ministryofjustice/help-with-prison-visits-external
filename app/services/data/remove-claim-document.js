const knexConfig = require('../../../knexfile').extweb
const knex = require('knex')(knexConfig)
const config = require('../../../config')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
})

module.exports = function (claimDocumentId) {
  return knex('ClaimDocument')
    .returning('Filepath')
    .where('ClaimDocumentId', claimDocumentId)
    .update({
      IsEnabled: false
    })
    .then(function (filepath) {
      if (filepath[0]) {
        const deleteParams = {
          Bucket: config.AWS_S3_BUCKET_NAME,
          Key: filepath[0]
        }
        s3.deleteObject(params, function(err) {
          if (err) {
            throw new Error(err)
          }
        })
      }
    })
}
