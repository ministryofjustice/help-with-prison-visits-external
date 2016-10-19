const expect = require('chai').expect
const AboutYouValidator = require('../../../../../app/services/validators/first-time/about-you-validator')

describe('services/validators/first-time/about-you-validator', function () {
  const VALID_DATA = {
    'Title': 'Mr',
    'FirstName': 'Tester',
    'LastName': 'Test',
    'NationalInsuranceNumber': 'AA123456B',
    'HouseNumberAndStreet': 'Test Street',
    'Town': 'Testing Town',
    'County': 'Test',
    'PostCode': 'BT123BT',
    'Country': 'Northern Ireland',
    'EmailAddress': 'test1@tester.com',
    'PhoneNumber': '555 555 555'
  }

  const INVALID_DATA = {
    'Title': '',
    'FirstName': '',
    'LastName': '',
    'NationalInsuranceNumber': '',
    'HouseNumberAndStreet': '',
    'Town': '',
    'County': '',
    'PostCode': '',
    'Country': '',
    'EmailAddress': '',
    'PhoneNumber': ''
  }

  it('should throw error if data is null', function (done) {
    expect(function () {
      AboutYouValidator(null)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is undefined', function (done) {
    expect(function () {
      AboutYouValidator(undefined)
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should throw error if data is an unexpected object', function (done) {
    expect(function () {
      AboutYouValidator({})
        .isRequired()
    }).to.throw(TypeError)
    done()
  })

  it('should return false if provided with valid data', function (done) {
    var errors = AboutYouValidator(VALID_DATA)
    expect(errors).to.equal(false)
    done()
  })

  it('should return an error object if provided with invalid data', function (done) {
    var errors = AboutYouValidator(INVALID_DATA)
    expect(errors).to.have.property('Title')
    done()
  })
})
