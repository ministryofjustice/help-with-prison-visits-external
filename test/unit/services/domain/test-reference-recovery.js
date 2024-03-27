const ReferenceRecovery = require('../../../../app/services/domain/reference-recovery')

describe('services/domain/reference-recovery', function () {
  const VALID_EMAIL = 'test@test.com'
  const VALID_PRISONER_NUMBER = 'B2781937'
  const INVALID_EMAIL = 'test'
  const INVALID_PRISONER_NUMBER = ''

  it('should construct a domain object given valid input', function () {
    const referenceRecovery = new ReferenceRecovery(VALID_EMAIL, VALID_PRISONER_NUMBER)
    expect(referenceRecovery.EmailAddress).toBe(VALID_EMAIL)
    expect(referenceRecovery.PrisonerNumber).toBe(VALID_PRISONER_NUMBER)
  })

  it('should throw an error if passed invalid email address', function () {
    expect(function () {
      new ReferenceRecovery(INVALID_EMAIL, VALID_PRISONER_NUMBER).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid prisoner number', function () {
    expect(function () {
      new ReferenceRecovery(VALID_EMAIL, INVALID_PRISONER_NUMBER).isValid()
    }).toThrow()
  })
})
