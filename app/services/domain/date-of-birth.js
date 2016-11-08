const ValidationError = require('../errors/validation-error')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const moment = require('moment')

class DateOfBirth {
  constructor (day, month, year) {
    this.fields = [
      day,
      month,
      year
    ]
    this.dob = dateFormatter.build(day, month, year)
    this.getDobFormatted = dateFormatter.buildFormatted(day, month, year)
    this.sixteenOrUnder = this.isSixteenOrUnder()
    this.IsValid()
  }

  isSixteenOrUnder () {
    const AGE_MUST_BE_OVER = 16
    if (this.dob >= moment().subtract(AGE_MUST_BE_OVER, 'years')) {
      return true
    }
    return false
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
