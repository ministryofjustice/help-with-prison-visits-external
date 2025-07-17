const HasEscort = require('../../../../app/services/domain/has-escort')

describe('services/domain/has-escort', () => {
  const VALID_INPUT = 'yes'
  const INVALID_INPUT = 'invalid input'

  it('should construct a domain object given valid input', () => {
    const hasEscort = new HasEscort(VALID_INPUT)
    expect(hasEscort.hasEscort).toBe(VALID_INPUT)
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new HasEscort(INVALID_INPUT).isValid()
    }).toThrow()
  })
})
