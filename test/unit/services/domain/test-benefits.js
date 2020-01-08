const Benefits = require('../../../../app/services/domain/benefits')
const ValidationError = require('../../../../app/services/errors/validation-error')
const benefitsEnum = require('../../../../app/constants/benefits-enum')
const expect = require('chai').expect

describe('services/domain/benefits', function () {
  const VALID_BENEFIT = benefitsEnum.INCOME_SUPPORT.urlValue
  const VALID_BENEFIT_OWNER = 'yes'
  const INVALID_BENEFIT = ''

  it('should construct a domain object given valid input', function () {
    var benefits = new Benefits(VALID_BENEFIT, VALID_BENEFIT_OWNER)
    expect(benefits.benefit).to.equal(VALID_BENEFIT)
    expect(benefits.benefitOwner).to.equal(VALID_BENEFIT_OWNER)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new Benefits(INVALID_BENEFIT).isValid()
    }).to.throw(ValidationError)
  })
})
