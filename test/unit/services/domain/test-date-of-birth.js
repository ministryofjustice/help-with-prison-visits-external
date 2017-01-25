const expect = require('chai').expect
const ValidationError = require('../../../../app/services/errors/validation-error')
const dateFormatter = require('../../../../app/services/date-formatter')
const DateOfBirth = require('../../../../app/services/domain/date-of-birth')
var dateOfBirth

describe('services/domain/date-of-birth', function () {
  const VALID_DAY = '01'
  const VALID_MONTH = '01'
  const VALID_YEAR = '1980'
  const VALID_DOB = '1980-01-01'

  const INVALID_DAY = ''
  const INVALID_MONTH = ''
  const INVALID_YEAR = ''

  it('should construct a domain object given valid input', function () {
    dateOfBirth = new DateOfBirth(VALID_DAY,
      VALID_MONTH,
      VALID_YEAR)

    expect(dateOfBirth.dob.toString()).to.equal(dateFormatter.buildFromDateString(VALID_DOB).toString())
    expect(dateOfBirth.getDobFormatted).to.equal(dateFormatter.buildFromDateString(VALID_DOB).format('YYYY-MM-DD'))
    expect(dateOfBirth.fields[0]).to.equal(VALID_DAY)
    expect(dateOfBirth.fields[1]).to.equal(VALID_MONTH)
    expect(dateOfBirth.fields[2]).to.equal(VALID_YEAR)
  })

  it('should return isRequired errors given empty strings', function () {
    expect(function () {
      new DateOfBirth(
        INVALID_DAY,
        INVALID_MONTH,
        INVALID_YEAR
      ).isValid()
    }).to.throw(ValidationError)
  })

  it('should return invalid date format when given invalid date', function () {
    expect(function () {
      new DateOfBirth(
        '30',
        '02',
        '1990'
      ).isValid()
    }).to.throw(ValidationError)
  })

  it('should return future dob message when given future date', function () {
    expect(function () {
      new DateOfBirth(
        '10',
        '10',
        '3500'
      ).isValid()
    }).to.throw(ValidationError)
  })

  it('should return under 16 error message when date is < 16 years', function () {
    expect(function () {
      new DateOfBirth(
        dateFormatter.now().date(),
        dateFormatter.now().month() + 1,
        dateFormatter.now().year()
      ).isValid()
    }).to.throw(ValidationError)
  })
})
