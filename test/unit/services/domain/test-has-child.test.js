const HasChild = require('../../../../app/services/domain/has-child')

describe('services/domain/has-child', () => {
  const VALID_INPUT = 'yes'
  const INVALID_INPUT = 'invalid input'

  it('should construct a domain object given valid input', () => {
    const hasChild = new HasChild(VALID_INPUT)
    expect(hasChild.hasChild).toBe(VALID_INPUT)
  })

  it('should throw an error if passed invalid data', () => {
    expect(() => {
      new HasChild(INVALID_INPUT).isValid()
    }).toThrow()
  })
})
