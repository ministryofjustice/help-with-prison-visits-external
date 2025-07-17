const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const getChangeAddressLink = require('../../../../app/routes/helpers/get-change-address-link')

const FIRST_TIME_LINK = `/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/about-you`
const REPEAT_LINK = '/your-claims/check-your-information'

describe('routes/helpers/get-change-address-link', () => {
  it('should return link for first time claim', () => {
    expect(getChangeAddressLink(claimTypeEnum.FIRST_TIME)).toBe(FIRST_TIME_LINK)
  })

  it('should return link for repeat claims', () => {
    expect(getChangeAddressLink(claimTypeEnum.REPEAT)).toBe(REPEAT_LINK)
  })
})
