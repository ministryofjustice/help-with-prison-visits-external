const claimTypeEnum = require('../../constants/claim-type-enum')

module.exports = claimType => {
  let uploadNotRequired = false
  if (claimType === claimTypeEnum.REPEAT_CLAIM || claimType === claimTypeEnum.REPEAT_DUPLICATE) {
    uploadNotRequired = true
  }
  return uploadNotRequired
}
