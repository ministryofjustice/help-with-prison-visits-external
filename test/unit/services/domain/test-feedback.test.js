const Feedback = require('../../../../app/services/domain/feedback')

describe('services/domain/feedback', () => {
  const VALID_RATING = 'satisfied'
  const VALID_IMPROVEMENTS = 'This is a test message'
  const INVALID_RATING = ''
  const INVALID_IMPROVEMENTS = new Array(1250).join('a')
  const VALID_EMAIL_ADDRESS = 'test@test.com'
  const INVALID_EMAIL_ADDRESS = 'dsadasdasda'

  it('should construct a domain object given valid input', () => {
    const feedback = new Feedback(VALID_RATING, VALID_IMPROVEMENTS, VALID_EMAIL_ADDRESS)
    expect(feedback.rating).toBe(VALID_RATING)
    expect(feedback.improvements).toBe(VALID_IMPROVEMENTS)
    expect(feedback.emailAddress).toBe(VALID_EMAIL_ADDRESS)
  })

  it('should throw an error if passed invalid rating', () => {
    expect(() => {
      new Feedback(INVALID_RATING, VALID_IMPROVEMENTS, VALID_EMAIL_ADDRESS).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid message', () => {
    expect(() => {
      new Feedback(VALID_RATING, INVALID_IMPROVEMENTS, VALID_EMAIL_ADDRESS).isValid()
    }).toThrow()
  })

  it('should throw an error if passed invalid email address', () => {
    expect(() => {
      new Feedback(VALID_RATING, VALID_IMPROVEMENTS, INVALID_EMAIL_ADDRESS).isValid()
    }).toThrow()
  })
})
