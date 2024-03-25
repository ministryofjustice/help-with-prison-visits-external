/* eslint-disable no-new */
const AboutEscort = require('../../../../app/services/domain/about-escort')
const dateFormatter = require('../../../../app/services/date-formatter')

describe('services/domain/about-escort', function () {
  const VALID_FIRST_NAME = 'first'
  const VALID_LAST_NAME = 'last'
  const VALID_DAY = '15'
  const VALID_MONTH = '05'
  const VALID_YEAR = '1985'
  const INVALID_DAY = 'invalid day'
  const INVALID_CHARS_FIRST_NAME = 'child&lt>&gtname>'

  it('should construct a domain object given valid input', function () {
    const escort = new AboutEscort(
      VALID_FIRST_NAME,
      VALID_LAST_NAME,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR
    )
    expect(escort.firstName).toBe(VALID_FIRST_NAME)
    expect(escort.dob).toEqual(dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR))
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new AboutEscort(
        INVALID_DAY,
        INVALID_DAY,
        VALID_MONTH,
        VALID_YEAR
      ).isValid()
    }).toThrow()
  })

  it('should throw a validation error if any inputs were not set and the default domain object values where used', function () {
    expect(function () {
      new AboutEscort()
    }).toThrow()
  })

  it('should strip illegal characters from otherwise valid input', function () {
    const unsafeInputPattern = />|<|&lt|&gt/g
    const escort = new AboutEscort(
      INVALID_CHARS_FIRST_NAME,
      VALID_LAST_NAME,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR
    )
    expect(escort.firstName).toBe(INVALID_CHARS_FIRST_NAME.replace(unsafeInputPattern, ''))
    expect(escort.dob).toEqual(dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR))
  })
})
