class ValidationError extends Error {
  constructor(validationErrors) {
    super('Validation errors', validationErrors)
    this.validationErrors = validationErrors
  }
}

module.exports = ValidationError
