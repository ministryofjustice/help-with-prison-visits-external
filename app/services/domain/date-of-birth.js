const ValidationError = require('../errors/validation-error')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')

class DateOfBirth {
  constructor (day, month, year) {
    this.fields = [
      day,
      month,
      year
    ]
    this.dob = dateFormatter.build(day, month, year)
    this.getDobFormatted = dateFormatter.buildFormatted(day, month, year)

    if (this.dob >= dateFormatter.now().subtract(16, 'years')) {
      this.sixteenOrUnder = true
    } else {
      this.sixteenOrUnder = false
    }

    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldsetValidator(this.fields, 'dob', errors)
      .isRequired()
      .isValidDate(this.dob)
      .isPastDate(this.dob)

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = DateOfBirth
