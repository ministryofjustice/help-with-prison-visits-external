var Promise = require('bluebird').Promise
var fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const logger = require('./log')

module.exports = function (tempPath, targetDir, targetFile) {
  return new Promise(function (resolve, reject) {
    var targetFilePath = path.join(targetDir, targetFile)
    return fs.createReadStream(tempPath)
      .pipe(fs.createWriteStream(targetFilePath))
      .on('error', function (error) {
        logger.error('Error occurred writing file ' + targetFilePath)
        return reject(error)
      })
      .on('finish', function () {
        logger.info(`Move file to location ${targetFilePath}`)
        return resolve({ dest: targetDir, path: targetFilePath })
      })
  })
}
