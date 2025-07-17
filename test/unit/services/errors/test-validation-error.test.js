const ValidationError = require('../../../../app/services/errors/validation-error')

describe('services/errors/validation-error', () => {
  it('should construct a validation error with errors provided', done => {
    const validationError = new ValidationError({ field: ['error message'] })
    expect(validationError.validationErrors.field[0]).toBe('error message')
    done()
  })
})
