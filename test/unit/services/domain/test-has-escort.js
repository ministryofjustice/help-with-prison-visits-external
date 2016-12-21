const HasEscort = require('../../../../app/services/domain/has-escort')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/has-escort', function () {
  const VALID_INPUT = 'yes'
  const INVALID_INPUT = 'invalid input'

  it('should construct a domain object given valid input', function () {
    var hasEscort = new HasEscort(
      VALID_INPUT
    )
    expect(hasEscort.hasEscort).to.equal(VALID_INPUT)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new HasEscort(
        INVALID_INPUT
      ).isValid()
    }).to.throw(ValidationError)
  })
})
