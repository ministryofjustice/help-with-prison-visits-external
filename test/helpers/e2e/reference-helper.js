const referenceIdHelper = require('../../../app/routes/helpers/reference-id-helper')

module.exports.extractReference = function (url) {
  var encryptedReference = url.split('/').pop()
  return referenceIdHelper.extractReferenceId(encryptedReference).reference
}
