const claimTypeEnum = require('../../constants/claim-type-enum')

module.exports = function (claimType) {
  if (claimType === claimTypeEnum.FIRST_TIME) {
    return '/apply/first-time/new-eligibility/about-you'
  } else {
    return '/your-claims/check-your-information'
  }
}
