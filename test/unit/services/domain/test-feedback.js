const Feedback = require('../../../../app/services/domain/feedback')
const ValidationError = require('../../../../app/services/errors/validation-error')
const expect = require('chai').expect

describe('services/domain/feedback', function () {
  const VALID_RATING = 'satisfied'
  const VALID_IMPROVEMENTS = 'This is a test message'
  const INVALID_RATING = ''
  const INVALID_IMPROVEMENTS = new Array(1250).join('a')

  it('should construct a domain object given valid input', function () {
    var feedback = new Feedback(VALID_RATING, VALID_IMPROVEMENTS)
    expect(feedback.rating).to.equal(VALID_RATING)
    expect(feedback.improvements).to.equal(VALID_IMPROVEMENTS)
  })

  it('should throw an error if passed invalid rating', function () {
    expect(function () {
      new Feedback(INVALID_RATING, VALID_IMPROVEMENTS).isValid()
    }).to.throw(ValidationError)
  })

  it('should throw an error if passed invalid message', function () {
    expect(function () {
      new Feedback(VALID_RATING, INVALID_IMPROVEMENTS).isValid()
    }).to.throw(ValidationError)
  })
})
