const AboutChild = require('../../../../app/services/domain/about-child')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect
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
    var child = new AboutChild(
      VALID_FIRST_NAME,
      VALID_LAST_NAME,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR,
      VALID_CHILD_RELATIONSHIP
    )
    expect(child.firstName).to.equal(VALID_FIRST_NAME)
    expect(child.lastName).to.equal(VALID_LAST_NAME)
    expect(child.dob).to.deep.equal(dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR))
    expect(child.childRelationship).to.equal(VALID_CHILD_RELATIONSHIP)
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
      ).isValid()
    }).to.throw(ValidationError)
  })

  it('should strip illegal characters from otherwise valid input', function () {
    const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
    var child = new AboutChild(
      VALID_FIRST_NAME,
      INVALID_CHARS_LAST_NAME,
      VALID_DAY,
      VALID_MONTH,
      VALID_YEAR,
      VALID_CHILD_RELATIONSHIP
    )
    expect(child.firstName).to.equal(VALID_FIRST_NAME)
    expect(child.lastName).to.equal(INVALID_CHARS_LAST_NAME.replace(unsafeInputPattern, ''))
    expect(child.dob).to.deep.equal(dateFormatter.build(VALID_DAY, VALID_MONTH, VALID_YEAR))
    expect(child.childRelationship).to.equal(VALID_CHILD_RELATIONSHIP)
  })
})
