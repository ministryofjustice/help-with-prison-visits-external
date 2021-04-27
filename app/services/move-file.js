const Promise = require('bluebird').Promise
const fs = Promise.promisifyAll(require('fs'))
const logger = require('./log')
const config = require('../../config')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: config.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_S3_ACCESS_KEY_SECRET
})

module.exports = function (tempPath, targetDir, targetFile) {
  return new Promise(function (resolve, reject) {
    const targetFileName = `${targetDir}${config.FILE_SEPARATOR}${targetFile}`
    const uploadParams = {
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: targetFileName,
      Body: ''
    }

    const fileStream = fs.createReadStream(tempPath)
      .on('error', function (error) {
        logger.error('Error occurred writing file ' + targetFileName)
        return reject(error)
      })
      .on('finish', function () {
        logger.info(`Move file to location ${targetFileName}`)
      })

    uploadParams.Body = fileStream

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        logger.error('Error', err)
      } if (data) {
        logger.info('Upload Success', data.Location)
        return resolve(targetFileName)
      }
    })
  })
}
