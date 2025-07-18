const EnumHelper = require('../../../../app/constants/helpers/enum-helper')
const BenefitsEnum = require('../../../../app/constants/benefits-enum')

describe('constants/helpers/enum-helper', () => {
  const VALID_VALUE = BenefitsEnum.INCOME_SUPPORT.value
  const INVALID_VALUE = 'some invalid value'
  const VALID_DISPLAYNAME = BenefitsEnum.INCOME_SUPPORT.displayName
  const VALID_ATTRIBUTE = 'displayName'
  const INVALID_ATTRIBUTE = 'invalid'

  it('should return the enumerated object whose value equals the value given and no attribute', () => {
    const result = EnumHelper.getKeyByAttribute(BenefitsEnum, VALID_VALUE)
    expect(result).toBe(BenefitsEnum.INCOME_SUPPORT)
  })

  it('should return the given value if no match was found.', () => {
    const result = EnumHelper.getKeyByAttribute(BenefitsEnum, INVALID_VALUE)
    expect(result).toBe(INVALID_VALUE)
  })

  it('should return the given value if the value given was not an object.', () => {
    const result = EnumHelper.getKeyByAttribute(BenefitsEnum, null)
    expect(result).toBeNull()
  })

  it('should return the correct value based on attribute.', () => {
    const result = EnumHelper.getKeyByAttribute(BenefitsEnum, VALID_DISPLAYNAME, VALID_ATTRIBUTE)
    expect(result).toBe(BenefitsEnum.INCOME_SUPPORT)
  })

  it('should return the given value if no match was found for an invalid attribute.', () => {
    const result = EnumHelper.getKeyByAttribute(BenefitsEnum, VALID_VALUE, INVALID_ATTRIBUTE)
    expect(result).toBe(VALID_VALUE)
  })
})
