const ValidationError = require('../errors/validation-error')
const FieldsetValidator = require('../validators/fieldset-validator')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
const MINIMUM_AGE_IN_YEARS = 18

class AboutEscort {
  constructor (firstName, lastName, day, month, year, nationalInsuranceNumber) {
    this.firstName = firstName ? firstName.replace(unsafeInputPattern, '').trim() : ''
    this.lastName = lastName ? lastName.replace(unsafeInputPattern, '').trim() : ''
    this.dobFields = [
      day ? day.trim() : '',
      month ? month.trim() : '',
      year ? year.trim() : ''
    ]
    this.dob = dateFormatter.build(day, month, year)
    this.nationalInsuranceNumber = nationalInsuranceNumber ? nationalInsuranceNumber.trim() : ''
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.firstName, 'FirstName', errors)
      .isRequired()
      .isRange(1, 100)

    FieldValidator(this.lastName, 'LastName', errors)
      .isRequired()
      .isRange(1, 100)

    FieldsetValidator(this.dobFields, 'dob', errors)
      .isRequired()
      .isValidDate(this.dob)
      .isPastDate(this.dob)
      .isOlderThanInYears(this.dob, MINIMUM_AGE_IN_YEARS)

    FieldValidator(this.nationalInsuranceNumber, 'NationalInsuranceNumber', errors)
      .isRequired()
      .isNationalInsuranceNumber()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = AboutEscort
