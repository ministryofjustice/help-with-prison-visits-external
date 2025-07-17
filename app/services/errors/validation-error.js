// const ValidationError = validationErrors => {
//   Error.captureStackTrace(this, this.constructor)
//   this.name = this.constructor.name
//   this.message = 'Validation errors'
//   this.validationErrors = validationErrors
// }

class ValidationError extends Error {
  constructor(validationErrors) {
    // Need to pass `options` as the second parameter to install the "cause" property.
    super('Validation errors', validationErrors)
    this.validationErrors = validationErrors
  }
}

module.exports = ValidationError
