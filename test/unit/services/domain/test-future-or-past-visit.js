const FutureOrPastVisit = require('../../../../app/services/domain/future-or-past-visit')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/future-or-past-visit', function () {
  const VALID_INPUT = 'past'
  const INVALID_INPUT = 'invalid input'

  it('should construct a domain object given valid input', function () {
    var futureOrPastVisit = new FutureOrPastVisit(
      VALID_INPUT
    )
    expect(futureOrPastVisit.advancePast).to.equal(VALID_INPUT)
  })

  it('should throw an error if passed invalid data', function () {
    expect(function () {
      new FutureOrPastVisit(
        INVALID_INPUT
      ).isValid()
    }).to.throw(ValidationError)
  })
})
