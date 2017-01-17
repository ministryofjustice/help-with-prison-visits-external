const claimTypeEnum = require('../../constants/claim-type-enum')

module.exports = function (claimType) {
  var uploadNotRequired = false
  if (claimType === claimTypeEnum.REPEAT_CLAIM || claimType === claimTypeEnum.REPEAT_DUPLICATE) {
    uploadNotRequired = true
  }
  return uploadNotRequired
}
