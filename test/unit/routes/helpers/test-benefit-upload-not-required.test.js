const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const benefitUploadNotRequired = require('../../../../app/routes/helpers/benefit-upload-not-required')

describe('routes/helpers/benefit-upload-not-required', () => {
  it('should return true for repeat claims with no new eligibility', () => {
    expect(benefitUploadNotRequired(claimTypeEnum.REPEAT_CLAIM)).toBe(true)  //eslint-disable-line
    expect(benefitUploadNotRequired(claimTypeEnum.REPEAT_DUPLICATE)).toBe(true)  //eslint-disable-line
  })

  it('should return false for first-time claims and repeat with eligibility changes', () => {
    expect(benefitUploadNotRequired(claimTypeEnum.FIRST_TIME)).toBe(false)  //eslint-disable-line
    expect(benefitUploadNotRequired(claimTypeEnum.REPEAT_NEW_ELIGIBILITY)).toBe(false)  //eslint-disable-line
  })
})
