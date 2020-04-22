const Feedback = require('../../../../app/services/domain/feedback')
const expect = require('chai').expect

describe('services/domain/feedback', function () {
  const VALID_RATING = 'satisfied'
  const VALID_IMPROVEMENTS = 'This is a test message'
  const INVALID_RATING = ''
  const INVALID_IMPROVEMENTS = new Array(1250).join('a')
  const VALID_EMAIL_ADDRESS = 'test@test.com'
  const INVALID_EMAIL_ADDRESS = 'dsadasdasda'

  it('should construct a domain object given valid input', function () {
    var feedback = new Feedback(VALID_RATING, VALID_IMPROVEMENTS, VALID_EMAIL_ADDRESS)
    expect(feedback.rating).to.equal(VALID_RATING)
    expect(feedback.improvements).to.equal(VALID_IMPROVEMENTS)
    expect(feedback.emailAddress).to.equal(VALID_EMAIL_ADDRESS)
  })

  it('should throw an error if passed invalid rating', function () {
    expect(function () {
      new Feedback(INVALID_RATING, VALID_IMPROVEMENTS, VALID_EMAIL_ADDRESS).isValid()
    }).to.throw()
  })

  it('should throw an error if passed invalid message', function () {
    expect(function () {
      new Feedback(VALID_RATING, INVALID_IMPROVEMENTS, VALID_EMAIL_ADDRESS).isValid()
    }).to.throw()
  })

  it('should throw an error if passed invalid email address', function () {
    expect(function () {
      new Feedback(VALID_RATING, VALID_IMPROVEMENTS, INVALID_EMAIL_ADDRESS).isValid()
    }).to.throw()
  })
})
