const claimTypeEnum = require('../../constants/claim-type-enum')

module.exports = claimType => {
  if (claimType === claimTypeEnum.FIRST_TIME) {
    return '/apply/first-time/new-eligibility/about-you'
  }
  return '/your-claims/check-your-information'
}
