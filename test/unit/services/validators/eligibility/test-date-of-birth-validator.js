const expect = require('chai').expect
const DateOfBirthValidator = require('../../../../../app/services/validators/eligibility/date-of-birth-validator')

describe('services/validators/eligibility/date-of-birth-validator', function () {
  const VALID_DATA = {
    'dob-day': 1,
    'dob-month': 1,
    'dob-year': 2000
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
})
