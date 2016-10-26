const ValidationError = require('../../../../app/services/errors/validation-error.js')
const expect = require('chai').expect

describe('services/errors/validation-error', function () {
  it('should construct a validation error with errors provided', function (done) {
    var validationError = new ValidationError({ field: ['error message'] })
    expect(validationError.validationErrors['field'][0]).to.equal('error message')
    done()
  })
})
