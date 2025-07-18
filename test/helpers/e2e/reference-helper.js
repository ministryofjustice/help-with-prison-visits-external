const referenceIdHelper = require('../../../app/routes/helpers/reference-id-helper')

module.exports.extractReference = url => {
  const encryptedReference = url.split('/').pop()
  return referenceIdHelper.extractReferenceId(encryptedReference).reference
}
