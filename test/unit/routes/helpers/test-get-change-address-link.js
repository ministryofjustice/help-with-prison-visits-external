const expect = require('chai').expect
const claimTypeEnum = require('../../../../app/constants/claim-type-enum')
const getChangeAddressLink = require('../../../../app/routes/helpers/get-change-address-link')

const FIRST_TIME_LINK = `/apply/${claimTypeEnum.FIRST_TIME}/new-eligibility/about-you`
const REPEAT_LINK = '/your-claims/check-your-information'

describe('routes/helpers/get-change-address-link', function () {
  it('should return link for first time claim', function () {
    expect(getChangeAddressLink(claimTypeEnum.FIRST_TIME)).to.equal(FIRST_TIME_LINK)
  })

  it('should return link for repeat claims', function () {
    expect(getChangeAddressLink(claimTypeEnum.REPEAT)).to.equal(REPEAT_LINK)
  })
})
