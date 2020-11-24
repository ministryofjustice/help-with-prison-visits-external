const config = require('../../config')
const fs = require('fs')
const mkdirp = require('mkdirp')

module.exports = function (referenceId, claimId, claimExpenseId, documentType) {
  let path
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
