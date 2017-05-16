const TechnicalHelp = require('../../../../app/services/domain/technical-help')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/technical-help', function () {
  const VALID_NAME = 'Joe Bloggs'
  const VALID_EMAIL_ADDRESS = 'test@test.com'
  const VALID_ISSUE = 'This is a test message'
  const INVALID_NAME = ''
  const INVALID_EMAIL_ADDRESS = 'dsadasdasda'
  const INVALID_ISSUE = new Array(1250).join('a')

  it('should construct a domain object given valid input', function () {
    var technicalHelp = new TechnicalHelp(VALID_NAME, VALID_EMAIL_ADDRESS, VALID_ISSUE)
    expect(technicalHelp.name).to.equal(VALID_NAME)
    expect(technicalHelp.emailAddress).to.equal(VALID_EMAIL_ADDRESS)
    expect(technicalHelp.issue).to.equal(VALID_ISSUE)
  })

  it('should throw an error if passed invalid name', function () {
    expect(function () {
      new TechnicalHelp(INVALID_NAME, VALID_EMAIL_ADDRESS, VALID_ISSUE).isValid()
    }).to.throw(ValidationError)
  })

  it('should throw an error if passed invalid email address', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, INVALID_EMAIL_ADDRESS, VALID_ISSUE).isValid()
    }).to.throw(ValidationError)
  })

  it('should throw an error if passed invalid issue', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, VALID_EMAIL_ADDRESS, INVALID_ISSUE).isValid()
    }).to.throw(ValidationError)
  })
})
