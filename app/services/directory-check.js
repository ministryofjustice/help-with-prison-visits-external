const config = require('../../config')
var fs = require('fs')
var mkdirp = require('mkdirp')

module.exports = function (referenceId, claimId, claimExpenseId, documentType) {
  var path
  if (!claimId) {
    path = `${config.FILE_UPLOAD_LOCATION}/${referenceId}/${documentType}`
  } else if (!claimExpenseId) {
    path = `${config.FILE_UPLOAD_LOCATION}/${referenceId}/${claimId}/${documentType}`
  } else {
    path = `${config.FILE_UPLOAD_LOCATION}/${referenceId}/${claimId}/${claimExpenseId}/${documentType}`
  }
  if (!fs.existsSync(path)) {
    mkdirp.sync(path)
  }
}
