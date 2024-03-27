const ValidationError = require('../../../../app/services/errors/validation-error.js')

describe('services/errors/validation-error', function () {
  it('should construct a validation error with errors provided', function (done) {
    const validationError = new ValidationError({ field: ['error message'] })
    expect(validationError.validationErrors.field[0]).toBe('error message')
    done()
  })
})
