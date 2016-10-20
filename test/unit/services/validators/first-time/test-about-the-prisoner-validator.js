var expect = require('chai').expect
const AboutThePrisonerValidator = require('../../../../../app/services/validators/first-time/about-the-prisoner-validator')

describe('services/validators/first-time/about-the-prisoner-validator', function () {
  const VALID_DATA = {
    'FirstName': 'Joe',
    'LastName': 'Bloggs',
    'dob-day': '01',
    'dob-month': '01',
    'dob-year': '1995',
    'PrisonerNumber': 'A1234BC',
    'NameOfPrison': 'Hewell'
  }
  const INVALID_DATA = {
    'FirstName': '',
    'LastName': '',
    'dob-day': '',
    'dob-month': '',
    'dob-year': '',
    'PrisonerNumber': '',
    'NameOfPrison': ''
  }

  it('should return false for valid data', function (done) {
    var errors = AboutThePrisonerValidator(VALID_DATA)
    expect(errors).to.be.false
    done()
  })

  it('should return errors for no data input', function (done) {
    var errors = AboutThePrisonerValidator(INVALID_DATA)
    expect(errors).to.have.all.keys([
      'FirstName',
      'LastName',
      'dob',
      'PrisonerNumber',
      'NameOfPrison'
    ])

    var errorMessage = errors['FirstName'][0]
    expect(errorMessage).to.equal('First name is required')
    done()
  })

  it('should return errors for an invalid date', function (done) {
    var INVALID_DAY = {
      'FirstName': 'Joe',
      'LastName': 'Bloggs',
      'dob-day': '99',
      'dob-month': '01',
      'dob-year': '1995',
      'PrisonerNumber': 'A1234BC',
      'NameOfPrison': 'Hewell'
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
