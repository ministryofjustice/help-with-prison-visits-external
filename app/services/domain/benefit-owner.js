const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const dateFormatter = require('../date-formatter')
const ErrorHandler = require('../validators/error-handler')
const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class BenefitsAbout {
  constructor (firstName, lastName, dobDay, dobMonth, dobYear, nationalInsuranceNumber) {
    this.firstName = firstName ? firstName.replace(unsafeInputPattern, '').trim() : ''
    this.lastName = lastName ? lastName.replace(unsafeInputPattern, '').trim() : ''
    this.dobDay = dobDay
    this.dobMonth = dobMonth
    this.dobYear = dobYear
    this.nationalInsuranceNumber = nationalInsuranceNumber ? nationalInsuranceNumber.replace(/ /g, '').toUpperCase() : ''

    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.firstName, 'FirstName', errors)
      .isRequired(ERROR_MESSAGES.getEnterBenefitOwnerFirstName)
      .isLessThanLength(100, ERROR_MESSAGES.getBenefitOwnerNameLessThanLengthMessage)

    FieldValidator(this.lastName, 'LastName', errors)
      .isRequired(ERROR_MESSAGES.getEnterBenefitOwnerLastName)
      .isLessThanLength(100, ERROR_MESSAGES.getBenefitOwnerNameLessThanLengthMessage)

    var dobFields = [
      this.dobDay,
      this.dobMonth,
      this.dobYear
    ]

    var dob = dateFormatter.build(this.dobDay, this.dobMonth, this.dobYear)

    FieldsetValidator(dobFields, 'dob', errors)
      .isRequired(ERROR_MESSAGES.getEnterBenefitOwnerDateOfBirth)
      .isValidDate(dob)
      .isPastDate(dob)

    FieldValidator(this.nationalInsuranceNumber, 'NationalInsuranceNumber', errors)
      .isRequired(ERROR_MESSAGES.getEnterBenefitOwnerNINNumber)
      .isLength(9)
      .isNationalInsuranceNumber()

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }

    this.dob = dob.format('YYYY-MM-DD')
  }
}

module.exports = BenefitsAbout
