const HasEscort = require('../../../../app/services/domain/has-escort')

describe('services/domain/has-escort', function () {
  const VALID_INPUT = 'yes'
  const INVALID_INPUT = 'invalid input'

  it('should construct a domain object given valid input', function () {
    const hasEscort = new HasEscort(
      VALID_INPUT
    )
    expect(hasEscort.hasEscort).toBe(VALID_INPUT)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new HasEscort(
        INVALID_INPUT
      ).isValid()
    }).toThrow()
  })
})
