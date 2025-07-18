const path = require('path')
const AWSHelper = require('./aws-helper')

const aws = new AWSHelper()

module.exports = async (tempPath, targetDir, targetFile) => {
  const targetFilePath = path.join(targetDir, targetFile)

  try {
    return await aws.upload(targetFilePath, tempPath)
  } catch (error) {
    throw new Error(error)
  }
}
