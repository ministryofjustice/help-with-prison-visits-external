const ValidationError = require('../errors/validation-error')
const FieldsetValidator = require('../validators/fieldset-validator')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const CHILD_MAXIMUM_AGE_IN_YEARS = 18
const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)

class AboutChild {
  constructor (firstName, lastName, day, month, year, childRelationship) {
    this.firstName = firstName ? firstName.replace(unsafeInputPattern, '').trim() : ''
    this.lastName = lastName ? lastName.replace(unsafeInputPattern, '').trim() : ''
    this.dobFields = [
      day ? day.trim() : '',
      month ? month.trim() : '',
      year ? year.trim() : ''
    ]
    this.dob = dateFormatter.build(day, month, year)
    this.childRelationship = childRelationship ? childRelationship.trim() : ''
    this.isValid()
  }

  isValid () {
    var errors = ErrorHandler()

    FieldValidator(this.firstName, 'first-name', errors)
      .isRequired()

    FieldValidator(this.lastName, 'last-name', errors)
      .isRequired()

    FieldsetValidator(this.dobFields, 'dob', errors)
      .isRequired()
      .isValidDate(this.dob)
      .isPastDate(this.dob)
      .isYoungerThanInYears(this.dob, CHILD_MAXIMUM_AGE_IN_YEARS)

    FieldValidator(this.childRelationship, 'child-relationship', errors)
      .isRequired()
      .isValidChildRelationship()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = AboutChild
