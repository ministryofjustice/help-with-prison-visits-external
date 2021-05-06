const Promise = require('bluebird').Promise
const path = require('path')
const { AWSHelper } = require('./aws-helper')
const aws = new AWSHelper()

module.exports = function (tempPath, targetDir, targetFile) {
  return new Promise(function (resolve, reject) {
    const targetFilePath = path.join(targetDir, targetFile)

    try {
      return resolve(aws.upload(targetFilePath, tempPath))
    } catch (error) {
      reject(error)
    }
  })
}
