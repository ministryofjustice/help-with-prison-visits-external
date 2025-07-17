const MockCheckYourInformation = require('../../../../app/services/domain/check-your-information')

describe('services/domain/check-your-information', () => {
  it('should construct a domain object given valid input', () => {
    const checkYourInformation = new MockCheckYourInformation('true')
    expect(checkYourInformation.confirmCorrect).toBe('true')
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new MockCheckYourInformation(null).isValid()
    }).toThrow()
  })
})
