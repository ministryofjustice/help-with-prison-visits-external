/* eslint-disable no-new */
const dateFormatter = require('../../../../app/services/date-formatter');
const DateOfBirth = require('../../../../app/services/domain/date-of-birth')

let dateOfBirth

describe('services/domain/date-of-birth', function () {
  const VALID_DAY = '01'
  const VALID_MONTH = '01'
  const VALID_PAST_YEAR = '1980'
  const VALID_FUTURE_YEAR = '3000'
  const VALID_DOB = '1980-01-01'

  const INVALID_DAY = '32'
  const INVALID_MONTH = '13'
  const INVALID_YEAR = ''

  it('should construct a domain object given valid input', function () {
    dateOfBirth = new DateOfBirth(
      VALID_DAY,
      VALID_MONTH,
      VALID_PAST_YEAR
    )

    expect(dateOfBirth.dob.toString()).toBe(dateFormatter.buildFromDateString(VALID_DOB).toString())
    expect(dateOfBirth.encodedDate).toBe(dateFormatter.encodeDate(dateFormatter.buildFromDateString(VALID_DOB)))
    expect(dateOfBirth.fields[0]).toBe(VALID_DAY)
    expect(dateOfBirth.fields[1]).toBe(VALID_MONTH)
    expect(dateOfBirth.fields[2]).toBe(VALID_PAST_YEAR)
  })

  it('should throw ValidationError if a future date was given', function () {
    expect(function () {
      new DateOfBirth(
        VALID_DAY,
        VALID_MONTH,
        VALID_FUTURE_YEAR
      )
    }).toThrow()
  })

  it('should throw ValidationError if date is under 16 years', function () {
    expect(function () {
      new DateOfBirth(
        dateFormatter.now().date(),
        dateFormatter.now().month() + 1,
        dateFormatter.now().year()
      )
    }).toThrow()
  })

  it('should throw ValidationError if given invalid day, month, or year', function () {
    expect(function () {
      new DateOfBirth(
        INVALID_DAY,
        INVALID_MONTH,
        INVALID_YEAR
      )
    }).toThrow()
  })
})
