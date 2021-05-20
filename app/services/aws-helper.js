const { v4: uuidv4 } = require('uuid')
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

  async delete (key) {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key
    }

    try {
      await this.s3.deleteObject(deleteParams).promise()
    } catch (error) {
      log.error(`Problem deleting file ${key}`)
      throw new Error(error)
    }
  }

  async upload (key, source) {
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

    try {
      const uploadResult = await this.s3.upload(uploadParams).promise()
      log.info('Upload Success', uploadResult.Location, key)
      return key
    } catch (error) {
      log.error(`Error occurred uploading file to s3 ${key}`, error)
      throw new Error(error)
    }
  }

  async download (key) {
    const downloadParams = {
      Bucket: this.bucketName,
      Key: key
    }
    const randomFilename = uuidv4()
    const tempFile = `${config.FILE_TMP_DIR}/${randomFilename}`

    try {
      const data = await this.s3.getObject(downloadParams).promise()
      fs.writeFileSync(tempFile, data.Body)
    } catch (error) {
      throw new Error(error)
    }

    return tempFile
  }
}

module.exports = {
  AWSHelper
}
