const TechnicalHelp = require('../../../../app/services/domain/technical-help')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/technical-help', function () {
  const VALID_NAME = 'Joe Bloggs'
  const VALID_PHONE_NUMBER = '08378359204'
  const VALID_ISSUE = 'This is a test message'
  const INVALID_NAME = ''
  const INVALID_PHONE_NUMBER = ''
  const INVALID_ISSUE = new Array(1250).join('a')

  it('should construct a domain object given valid input', function () {
    var technicalHelp = new TechnicalHelp(VALID_NAME, VALID_PHONE_NUMBER, VALID_ISSUE)
    expect(technicalHelp.name).to.equal(VALID_NAME)
    expect(technicalHelp.PhoneNumber).to.equal(VALID_PHONE_NUMBER)
    expect(technicalHelp.issue).to.equal(VALID_ISSUE)
  })

  it('should throw an error if passed invalid name', function () {
    expect(function () {
      new TechnicalHelp(INVALID_NAME, VALID_PHONE_NUMBER, VALID_ISSUE).isValid()
    }).to.throw(ValidationError)
  })

  it('should throw an error if passed invalid phone number', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, INVALID_PHONE_NUMBER, VALID_ISSUE).isValid()
    }).to.throw(ValidationError)
  })

  it('should throw an error if passed invalid issue', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, VALID_PHONE_NUMBER, INVALID_ISSUE).isValid()
    }).to.throw(ValidationError)
  })
})
