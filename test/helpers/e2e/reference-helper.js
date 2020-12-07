const referenceIdHelper = require('../../../app/routes/helpers/reference-id-helper')

module.exports.extractReference = function (url) {
  const encryptedReference = url.split('/').pop()
  return referenceIdHelper.extractReferenceId(encryptedReference).reference
}
