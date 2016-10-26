const ValidationError = function (validationErrors) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = 'Validation errors'
  this.validationErrors = validationErrors
}

module.exports = ValidationError
