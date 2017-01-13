const config = require('../../config')
var fs = require('fs')
var mkdirp = require('mkdirp')

module.exports = function (referenceId, claimExpenseId, documentType) {
  var path
  if (!claimExpenseId) {
    path = `${config.FILE_UPLOAD_LOCATION}/${referenceId}/${documentType}`
  } else {
    path = `${config.FILE_UPLOAD_LOCATION}/${referenceId}/${claimExpenseId}/${documentType}`
  }
  if (!fs.existsSync(path)) {
    mkdirp.sync(path)
  }
}
