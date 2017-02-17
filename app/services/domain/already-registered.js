const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const ERROR_MESSAGES = require('../validators/validation-error-messages')
const MINIMUM_AGE_IN_YEARS = 16

class AlreadyRegistered {
  constructor (reference, day, month, year) {
    this.reference = reference
    this.fields = [ day, month, year ]
    this.dob = dateFormatter.build(day, month, year)
    this.dobEncoded = dateFormatter.encodeDate(this.dob)
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.reference, 'reference', errors)
      .isRequired(ERROR_MESSAGES.getEnterReference)
      .isLength(7)
      .isReference()

    FieldsetValidator(this.fields, 'dob', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourDateOfBirth)
      .isValidDate(this.dob)
      .isPastDate(this.dob)
      .isOlderThanInYears(this.dob, MINIMUM_AGE_IN_YEARS)

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = AlreadyRegistered
