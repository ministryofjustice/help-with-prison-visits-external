const expect = require('chai').expect
const dateOfBirthValidator = require('../../../../../app/services/validators/eligibility/date-of-birth-validator')

describe('/services/validators/eligibility/date-of-birth-validator', function () {
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

  // TODO: Test null being passed.
  // TODO: Test undefined being passed.
  // TODO: Test unexpected object being passed.

  it('should return false if provided with valid data', function (done) {
    var errors = dateOfBirthValidator(VALID_DATA)
    expect(errors).to.equal(false)
    done()
  })

  it('should return an error object if provided with invalid data', function (done) {
    var errors = dateOfBirthValidator(INVALID_DATA)
    expect(errors).to.have.property('dob')
    done()
  })
})
