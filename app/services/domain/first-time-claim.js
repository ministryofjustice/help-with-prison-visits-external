const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')

class FirstTimeClaim {
  constructor (
    reference,
    day,
    month,
    year
  ) {
    this.reference = reference
    this.dateOfJourney = dateFormatter.build(day, month, year).toDate()
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.reference, 'Reference', errors)
      .isRequired()

    FieldsetValidator(this.dateOfJourney, 'DateOfJourney', errors)
      .isValidDate(this.dateOfJourney)
      .isPastDate(this.dateOfJourney)
      .isDateWithinDays(this.dateOfJourney, 28)

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = FirstTimeClaim
