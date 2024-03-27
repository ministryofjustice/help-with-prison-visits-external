/* eslint-disable no-new */
const AboutChild = require('../../../../app/services/domain/about-child')
const dateFormatter = require('../../../../app/services/date-formatter')
const childRelationshipEnum = require('../../../../app/constants/child-relationship-enum')

describe('services/domain/about-child', function () {
  const VALID_FIRST_NAME = 'first'
  const VALID_LAST_NAME = 'last'
  const VALID_DAY = '15'
  const VALID_MONTH = '05'
  const VALID_YEAR = '2014'
  const VALID_CHILD_RELATIONSHIP = childRelationshipEnum.PRISONER_CHILD
  const INVALID_DAY = 'invalid day'
  const INVALID_CHARS_LAST_NAME = 'child&lt>&gtname>'

  it('should construct a domain object given valid input', function () {
    const child = new AboutChild(
      VALID_FIRST_NAME,
      VALID_LAST_NAME,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR,
      VALID_CHILD_RELATIONSHIP
    )
    expect(child.firstName).toBe(VALID_FIRST_NAME)
    expect(child.lastName).toBe(VALID_LAST_NAME)
    expect(child.dob).toEqual(dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR))
    expect(child.childRelationship).toBe(VALID_CHILD_RELATIONSHIP)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new AboutChild(
        VALID_FIRST_NAME,
        VALID_LAST_NAME,
        INVALID_DAY,
        VALID_MONTH,
        VALID_YEAR,
        VALID_CHILD_RELATIONSHIP
      )
    }).toThrow()
  })

  it('should throw a validation error if any inputs were not set and the default domain object values where used', function () {
    expect(function () {
      new AboutChild()
    }).toThrow()
  })

  it('should strip illegal characters from otherwise valid input', function () {
    const unsafeInputPattern = />|<|&lt|&gt/g
    const child = new AboutChild(
      VALID_FIRST_NAME,
      INVALID_CHARS_LAST_NAME,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR,
      VALID_CHILD_RELATIONSHIP
    )
    expect(child.firstName).toBe(VALID_FIRST_NAME)
    expect(child.lastName).toBe(INVALID_CHARS_LAST_NAME.replace(unsafeInputPattern, ''))
    expect(child.dob).toEqual(dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR))
    expect(child.childRelationship).toBe(VALID_CHILD_RELATIONSHIP)
  })
})
