const mockCheckYourInformation = require('../../../../app/services/domain/check-your-information')

describe('services/domain/check-your-information', function () {
  it('should construct a domain object given valid input', function () {
    const checkYourInformation = new mockCheckYourInformation('true')
    expect(checkYourInformation.confirmCorrect).toBe('true')
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new mockCheckYourInformation(null).isValid()
    }).toThrow()
  })
})
