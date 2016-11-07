const expect = require('chai').expect
const moment = require('moment')
const ValidationError = require('../../../../app/services/errors/validation-error')

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

  it('should construct a domain object given valid input', function (done) {
    dateOfBirth = new DateOfBirth(VALID_DAY,
      VALID_MONTH,
      VALID_YEAR)

    expect(dateOfBirth.dob.toString()).to.equal(moment(VALID_DOB).toString())
    expect(dateOfBirth.dobFormatted).to.equal(moment(VALID_DOB).format('YYYY-MM-DD'))
    expect(dateOfBirth.sixteenOrUnder).to.equal(false)
    expect(dateOfBirth.fields[0]).to.equal(VALID_DAY)
    expect(dateOfBirth.fields[1]).to.equal(VALID_MONTH)
    expect(dateOfBirth.fields[2]).to.equal(VALID_YEAR)
    done()
  })

  it('should return isRequired errors given empty strings', function (done) {
    try {
      dateOfBirth = new DateOfBirth(INVALID_DAY,
        INVALID_MONTH,
        INVALID_YEAR)
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['dob'][0]).to.contain('Date of birth is required')
    }
    done()
  })

  it('should return invalid date format when given invalid date', function (done) {
    try {
      dateOfBirth = new DateOfBirth('30',
        '02',
        '1990')
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)
      expect(e.validationErrors['dob'][0]).to.equal('Date of birth was invalid')
    }
    done()
  })

  it('should return future dob message when given future date', function (done) {
    try {
      dateOfBirth = new DateOfBirth('10',
        '10',
        '3500')
    } catch (e) {
      expect(e).to.be.instanceof(ValidationError)

      expect(e.validationErrors['dob'][0]).to.equal('Date of birth must be in the past')
    }
    done()
  })

  it('should have sixteenOrUnder field set as true', function (done) {
    dateOfBirth = new DateOfBirth(moment().date(),
      moment().month() + 1,
      moment().year())

    expect(dateOfBirth.sixteenOrUnder).to.equal(true)
    done()
  })
})
