const Promise = require('bluebird').Promise
const fs = Promise.promisifyAll(require('fs'))
const logger = require('./log')
const path = require('path')
const config = require('../../config')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
})

module.exports = function (tempPath, targetDir, targetFile) {
  return new Promise(function (resolve, reject) {
    const targetFilePath = path.join(targetDir, targetFile)
    const uploadParams = {
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: targetFilePath,
      Body: ''
    }

    const fileStream = fs.createReadStream(tempPath)
      .on('error', function (error) {
        logger.error('Error occurred writing file ' + targetFilePath)
        return reject(error)
      })
      .on('finish', function () {
        logger.info(`Move file to location ${targetFilePath}`)
      })

    uploadParams.Body = fileStream

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        logger.error('Error', err)
      } if (data) {
        logger.info('Upload Success', data.Location)
        return resolve(targetFilePath)
      }
    })
  })
}
