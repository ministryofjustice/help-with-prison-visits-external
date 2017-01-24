const ValidationError = require('../errors/validation-error')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const MINIMUM_AGE_IN_YEARS = 16

class DateOfBirth {
  constructor (day, month, year) {
    this.fields = [
      day,
      month,
      year
    ]
    this.dob = dateFormatter.build(day, month, year)
    this.getDobFormatted = dateFormatter.buildFormatted(day, month, year)
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldsetValidator(this.fields, 'dob', errors)
      .isRequired()
      .isValidDate(this.dob)
      .isPastDate(this.dob)
      .isOlderThanInYears(this.dob, MINIMUM_AGE_IN_YEARS)

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = DateOfBirth
