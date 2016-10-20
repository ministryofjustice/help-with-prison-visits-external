var expect = require('chai').expect
const AboutThePrisonerValidator = require('../../../../../app/services/validators/first-time/about-the-prisoner-validator')

describe('services/validators/first-time/about-the-prisoner-validator', function () {
  const VALID_DATA = {
    'firstName': 'Joe',
    'lastName': 'Bloggs',
    'dob-day': '01',
    'dob-month': '01',
    'dob-year': '1995',
    'prisonerNumber': 'A1234BC',
    'nameOfPrison': 'Hewell'
  }
  const INVALID_DATA = {
    'firstName': '',
    'lastName': '',
    'dob-day': '',
    'dob-month': '',
    'dob-year': '',
    'prisonerNumber': '',
    'nameOfPrison': ''
  }

  it('should return false for valid data', function (done) {
    var errors = AboutThePrisonerValidator(VALID_DATA)
    expect(errors).to.be.false
    done()
  })

  it('should return errors for no data input', function (done) {
    var errors = AboutThePrisonerValidator(INVALID_DATA)
    expect(errors).to.have.all.keys([
      'firstName',
      'lastName',
      'dob',
      'prisonerNumber',
      'nameOfPrison'
    ])

    var errorMessage = errors['firstName'][0]
    expect(errorMessage).to.equal('First name is required')
    done()
  })

  it('should return errors for an invalid date', function (done) {
    var INVALID_DAY = {
      'firstName': 'Joe',
      'lastName': 'Bloggs',
      'dob-day': '99',
      'dob-month': '01',
      'dob-year': '1995',
      'prisonerNumber': 'A1234BC',
      'nameOfPrison': 'Hewell'
    }

    var errors = AboutThePrisonerValidator(INVALID_DAY)
    expect(errors).to.have.all.keys([
      'dob'
    ])

    var errorMessage = errors['dob'][0]
    expect(errorMessage).to.equal('Date of birth was invalid')
    done()
  })
})
