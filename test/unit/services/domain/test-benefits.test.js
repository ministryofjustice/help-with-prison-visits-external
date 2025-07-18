const Benefits = require('../../../../app/services/domain/benefits')
const benefitsEnum = require('../../../../app/constants/benefits-enum')

describe('services/domain/benefits', () => {
  const VALID_BENEFIT = benefitsEnum.INCOME_SUPPORT.urlValue
  const VALID_BENEFIT_OWNER = 'yes'
  const INVALID_BENEFIT = ''

  it('should construct a domain object given valid input', () => {
    const benefits = new Benefits(VALID_BENEFIT, VALID_BENEFIT_OWNER)
    expect(benefits.benefit).toBe(VALID_BENEFIT)
    expect(benefits.benefitOwner).toBe(VALID_BENEFIT_OWNER)
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new Benefits(INVALID_BENEFIT).isValid()
    }).toThrow()
  })
})
