const AWS = require('aws-sdk')
const fs = require('fs')
const log = require('./log')
const config = require('../../config')

class AWSHelper {
  constructor ({ accessKeyId = config.AWS_ACCESS_KEY_ID, secretAccessKey = config.AWS_SECRET_ACCESS_KEY, bucketName = config.AWS_S3_BUCKET_NAME } = { }) {
    this.accessKeyId = accessKeyId
    this.secretAccessKey = secretAccessKey
    this.bucketName = bucketName
    this.s3 = new AWS.S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey
    })
  }

  delete (key) {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key
    }
    this.s3.deleteObject(deleteParams, function (error) {
      if (error) {
        log.error(`Problem deleting file ${key}`)
        throw new Error(error)
      }
    })
  }

  upload (key, source) {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: ''
    }

    const fileStream = fs.createReadStream(source)
      .on('error', function (error) {
        log.error(`Error occurred reading from file ${source}`, error)
        throw new Error(error)
      })

    uploadParams.Body = fileStream

    this.s3.upload(uploadParams).promise()
      .then(function (data) {
        log.info('Upload Success', data.Location)
        return key
      })
      .catch(function (error) {
        log.error(`Error occurred uploading file to s3 ${key}`, error)
        throw new Error(error)
      })
  }

  download (key) {
    const downloadParams = {
      Bucket: this.bucketName,
      Key: key
    }

    this.s3.getObject(downloadParams).promise().then((data) => {
      const tempFile = `${config.FILE_TMP_DIR}/${key}`
      fs.writeFileSync(tempFile, data.Body)
      return tempFile
    }).catch((err) => {
      throw err
    })
  }
}

module.exports = {
  AWSHelper
}
