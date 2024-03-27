const TechnicalHelp = require('../../../../app/services/domain/technical-help')

describe('services/domain/technical-help', function () {
  const VALID_NAME = 'Joe Bloggs'
  const VALID_EMAIL_ADDRESS = 'test@test.com'
  const VALID_ISSUE = 'This is a test message'
  const VALID_REFERENCE = ''
  const VALID_DAY = '1'
  const VALID_MONTH = '1'
  const VALID_YEAR = '2017'
  const INVALID_NAME = ''
  const INVALID_EMAIL_ADDRESS = 'dsadasdasda'
  const INVALID_REFERENCE = 'AB123'
  const INVALID_DAY = '32'
  const INVALID_MONTH = '13'
  const INVALID_YEAR = '1000'
  const INVALID_ISSUE = new Array(1250).join('a')

  it('should construct a domain object given valid input', function () {
    const technicalHelp = new TechnicalHelp(VALID_NAME, VALID_EMAIL_ADDRESS, VALID_REFERENCE, VALID_DAY, VALID_MONTH, VALID_YEAR, VALID_ISSUE)
    expect(technicalHelp.name).toBe(VALID_NAME)
    expect(technicalHelp.emailAddress).toBe(VALID_EMAIL_ADDRESS)
    expect(technicalHelp.referenceNumber).toBe(VALID_REFERENCE)
    expect(technicalHelp.dateOfClaim.format('D')).toBe(VALID_DAY)
    expect(technicalHelp.dateOfClaim.format('M')).toBe(VALID_MONTH)
    expect(technicalHelp.dateOfClaim.format('YYYY')).toBe(VALID_YEAR)
    expect(technicalHelp.issue).toBe(VALID_ISSUE)
  })

  it('should throw an error if passed invalid name', function () {
    expect(function () {
      new TechnicalHelp(INVALID_NAME, VALID_EMAIL_ADDRESS, VALID_REFERENCE, VALID_DAY, VALID_MONTH, VALID_YEAR, VALID_ISSUE).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid email address', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, INVALID_EMAIL_ADDRESS, VALID_REFERENCE, VALID_DAY, VALID_MONTH, VALID_YEAR, VALID_ISSUE).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid reference', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, VALID_EMAIL_ADDRESS, INVALID_REFERENCE, VALID_DAY, VALID_MONTH, VALID_YEAR, VALID_ISSUE).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid day', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, VALID_EMAIL_ADDRESS, VALID_REFERENCE, INVALID_DAY, VALID_MONTH, VALID_YEAR, VALID_ISSUE).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid month', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, VALID_EMAIL_ADDRESS, VALID_REFERENCE, VALID_DAY, INVALID_MONTH, VALID_YEAR, VALID_ISSUE).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid year', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, VALID_EMAIL_ADDRESS, VALID_REFERENCE, VALID_DAY, VALID_MONTH, INVALID_YEAR, VALID_ISSUE).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid issue', function () {
    expect(function () {
      new TechnicalHelp(VALID_NAME, VALID_EMAIL_ADDRESS, VALID_REFERENCE, VALID_DAY, VALID_MONTH, VALID_YEAR, INVALID_ISSUE).isValid()
    }).toThrow()
  })
})
