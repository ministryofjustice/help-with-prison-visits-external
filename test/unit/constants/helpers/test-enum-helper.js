const expect = require('chai').expect

const EnumHelper = require('../../../../app/constants/helpers/enum-helper')
const BenefitsEnum = require('../../../../app/constants/benefits-enum')

describe('constants/helpers/enum-helper', function () {
  const VALID_VALUE = BenefitsEnum.INCOME_SUPPORT.value
  const INVALID_VALUE = 'some invalid value'

  it('should return the enumerated object whose value equals the value given', function () {
    var result = EnumHelper.getKeyByValue(BenefitsEnum, VALID_VALUE)
    expect(result).to.equal(BenefitsEnum.INCOME_SUPPORT)
  })

  it('should return the given value if no match was found.', function () {
    var result = EnumHelper.getKeyByValue(BenefitsEnum, INVALID_VALUE)
    expect(result).to.equal(INVALID_VALUE)
  })

  it('should return the given value if the value given was not an object.', function () {
    var result = EnumHelper.getKeyByValue(BenefitsEnum, null)
    expect(result).to.equal(null)
  })
})
