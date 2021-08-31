const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')
const ERROR_MESSAGES = require('../validators/validation-error-messages')
const dateFormatter = require('../date-formatter')

class TechnicalHelp {
  constructor (name, emailAddress, referenceNumber, day, month, year, issue) {
    this.name = name ? name.trim() : ''
    this.emailAddress = emailAddress ? emailAddress.trim() : ''
    this.referenceNumber = referenceNumber ? referenceNumber.trim() : ''
    this.dateOfClaim = day || month || year ? dateFormatter.build(day, month, year) : ''
    this.issue = issue
    this.isValid()
  }

  isValid () {
    const errors = ErrorHandler()

    FieldValidator(this.name, 'name', errors)
      .isRequired()
      .isRange(1, 200)

    FieldValidator(this.emailAddress, 'EmailAddress', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourEmailAddress)
      .isLessThanLength(100)
      .isEmail()

    FieldValidator(this.referenceNumber, 'ReferenceNumber', errors)
      .isLessThanLength(100)
      .isEmptyOrReference()

    FieldsetValidator(this.dateOfClaim, 'DateOfClaim', errors)
      .isEmptyOrValidDate(this.dateOfClaim)

    FieldValidator(this.issue, 'issue', errors)
      .isRequired()
      .isLessThanLength(1200)

    const validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = TechnicalHelp
