const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const dateFormatter = require('../date-formatter')
const ErrorHandler = require('../validators/error-handler')
const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)

class AboutThePrisoner {
  constructor (firstName, lastName, dobDay, dobMonth, dobYear, prisonerNumber, nameOfPrison) {
    this.firstName = firstName ? firstName.replace(unsafeInputPattern, '').trim() : ''
    this.lastName = lastName ? lastName.replace(unsafeInputPattern, '').trim() : ''
    this.dobDay = dobDay
    this.dobMonth = dobMonth
    this.dobYear = dobYear
    this.prisonerNumber = prisonerNumber ? prisonerNumber.replace(/ /g, '').toUpperCase() : ''
    this.nameOfPrison = nameOfPrison ? nameOfPrison.trim() : ''

    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.firstName, 'FirstName', errors)
      .isRequired()
      .isLessThanLength(100)

    FieldValidator(this.lastName, 'LastName', errors)
      .isRequired()
      .isLessThanLength(100)

    var dobFields = [
      this.dobDay,
      this.dobMonth,
      this.dobYear
    ]

    var dob = dateFormatter.build(this.dobDay, this.dobMonth, this.dobYear)

    FieldsetValidator(dobFields, 'dob', errors)
      .isRequired()
      .isValidDate(dob)
      .isPastDate(dob)

    FieldValidator(this.prisonerNumber, 'PrisonerNumber', errors)
      .isRequired()
      .isLessThanLength(10)

    FieldValidator(this.nameOfPrison, 'NameOfPrison', errors)
      .isRequired()
      .isLessThanLength(100)

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }

    this.dob = dob.toDate()
  }
}

module.exports = AboutThePrisoner
