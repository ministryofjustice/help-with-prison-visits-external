const expect = require('chai').expect
const DateOfBirthValidator = require('../../../../../app/services/validators/eligibility/date-of-birth-validator')

describe('services/validators/eligibility/date-of-birth-validator', function () {
  const VALID_DATA = {
    'dob-day': '01',
    'dob-month': '01',
    'dob-year': '2000'
  }
  const INVALID_DATA = {
    'dob-day': '',
    'dob-month': '',
    'dob-year': ''
  }

  it('should throw error if data is null', function (done) {
    expect(function () {
      DateOfBirthValidator(null)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is undefined', function (done) {
    expect(function () {
      DateOfBirthValidator(undefined)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is an unexpected object', function (done) {
    expect(function () {
      DateOfBirthValidator({})
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should return false if provided with valid data', function (done) {
    var errors = DateOfBirthValidator(VALID_DATA)
    expect(errors).to.equal(false)
    done()
  })

  it('should return an error object if provided with invalid data', function (done) {
    var errors = DateOfBirthValidator(INVALID_DATA)
    expect(errors).to.have.property('dob')
    done()
  })

  it('should return an error object if provided with a day greater than 29 in February', function (done) {
    var data = {
      'dob-day': '31',
      'dob-month': '02',
      'dob-year': '1990'
    }
    var errors = DateOfBirthValidator(data)
    expect(errors).to.have.property('dob')
    done()
  })

  it('should return false if provided with 29th February on a leap year', function (done) {
    var data = {
      'dob-day': '29',
      'dob-month': '02',
      'dob-year': '1992'
    }
    var errors = DateOfBirthValidator(data)
    expect(errors).to.equal(false)
    done()
  })

  it('should return an error object if provided with 29th February and not a leap year', function (done) {
    var data = {
      'dob-day': '29',
      'dob-month': '02',
      'dob-year': '1993'
    }
    var errors = DateOfBirthValidator(data)
    expect(errors).to.have.property('dob')
    done()
  })

  it('should return an error object if provided with a date greater than 120 years ago', function (done) {
    var data = {
      'dob-day': '10',
      'dob-month': '02',
      'dob-year': '1850'
    }
    var errors = DateOfBirthValidator(data)
    expect(errors).to.have.property('dob')
    done()
  })
})
