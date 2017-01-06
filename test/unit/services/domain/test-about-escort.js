const AboutEscort = require('../../../../app/services/domain/about-escort')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect
const dateFormatter = require('../../../../app/services/date-formatter')

describe('services/domain/about-escort', function () {
  const VALID_FIRST_NAME = 'first'
  const VALID_LAST_NAME = 'last'
  const VALID_DAY = '15'
  const VALID_MONTH = '05'
  const VALID_YEAR = '1985'
  const VALID_NATIONAL_INSURANCE_NUMBER = 'AA123456A'
  const INVALID_DAY = 'invalid day'
  const INVALID_CHARS_FIRST_NAME = 'child&lt>&gtname>'

  it('should construct a domain object given valid input', function () {
    var escort = new AboutEscort(
      VALID_FIRST_NAME,
      VALID_LAST_NAME,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR,
      VALID_NATIONAL_INSURANCE_NUMBER
    )
    expect(escort.firstName).to.equal(VALID_FIRST_NAME)
    expect(escort.dob).to.deep.equal(dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR))
    expect(escort.nationalInsuranceNumber).to.equal(VALID_NATIONAL_INSURANCE_NUMBER)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new AboutEscort(
        INVALID_DAY,
        INVALID_DAY,
        VALID_MONTH,
        VALID_YEAR,
        VALID_NATIONAL_INSURANCE_NUMBER
      ).isValid()
    }).to.throw(ValidationError)
  })

  it('should strip illegal characters from otherwise valid input', function () {
    const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
    var escort = new AboutEscort(
      INVALID_CHARS_FIRST_NAME,
      VALID_LAST_NAME,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR,
      VALID_NATIONAL_INSURANCE_NUMBER
    )
    expect(escort.firstName).to.equal(INVALID_CHARS_FIRST_NAME.replace(unsafeInputPattern, ''))
    expect(escort.dob).to.deep.equal(dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR))
    expect(escort.nationalInsuranceNumber).to.equal(VALID_NATIONAL_INSURANCE_NUMBER)
  })
})
