const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const dateFormatter = require('../date-formatter')
const ErrorHandler = require('../validators/error-handler')

const unsafeInputPattern = />|<|&lt|&gt/g
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class AboutThePrisoner {
  constructor(firstName, lastName, dobDay, dobMonth, dobYear, prisonerNumber, nameOfPrison) {
    this.firstName = firstName ? firstName.replace(unsafeInputPattern, '').trim() : ''
    this.lastName = lastName ? lastName.replace(unsafeInputPattern, '').trim() : ''
    this.dobDay = dobDay
    this.dobMonth = dobMonth
    this.dobYear = dobYear
    this.prisonerNumber = prisonerNumber ? prisonerNumber.replace(/ /g, '').toUpperCase() : ''
    this.nameOfPrison = nameOfPrison ? nameOfPrison.trim() : ''

    this.IsValid()
  }

  IsValid() {
    const errors = ErrorHandler()

    FieldValidator(this.firstName, 'FirstName', errors)
      .isRequired(ERROR_MESSAGES.getEnterPrisonerFirstName)
      .isLessThanLength(100, ERROR_MESSAGES.getPrisonerNameLessThanLengthMessage)

    FieldValidator(this.lastName, 'LastName', errors)
      .isRequired(ERROR_MESSAGES.getEnterPrisonerLastName)
      .isLessThanLength(100, ERROR_MESSAGES.getPrisonerNameLessThanLengthMessage)

    const dobFields = [this.dobDay, this.dobMonth, this.dobYear]

    const dob = dateFormatter.build(this.dobDay, this.dobMonth, this.dobYear)

    FieldsetValidator(dobFields, 'dob', errors)
      .isRequired(ERROR_MESSAGES.getEnterPrisonerDateOfBirth)
      .isValidDate(dob)
      .isPastDate(dob)

    FieldValidator(this.prisonerNumber, 'PrisonerNumber', errors)
      .isRequired(ERROR_MESSAGES.getEnterPrisonerNumber)
      .isLessThanLength(10)

    FieldValidator(this.nameOfPrison, 'NameOfPrison', errors)
      .isRequired(ERROR_MESSAGES.getEnterPrison)
      .isLessThanLength(100)

    const validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }

    this.dob = dob.format('YYYY-MM-DD')
  }
}

module.exports = AboutThePrisoner
