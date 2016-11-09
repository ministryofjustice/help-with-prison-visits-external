const ValidationError = require('../errors/validation-error')
const FieldsetValidator = require('../validators/fieldset-validator')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const CHILD_MAXIMUM_AGE = 18

// TODO: Add unit test for this domain object.
class AboutChild {
  constructor (childName, day, month, year, childRelationship) {
    console.log(childName)
    console.log(day)
    console.log(month)
    console.log(year)
    console.log(childRelationship)

    this.childName = childName ? childName.trim() : ''
    this.dobFields = [
      day ? day.trim() : '',
      month ? month.trim() : '',
      year ? year.trim() : ''
    ]
    this.dob = dateFormatter.build(day, month, year)
    this.childRelationship = childRelationship ? childRelationship.trim() : ''
    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.childName, 'child-name', errors)
      .isRequired()

    FieldsetValidator(this.dobFields, 'dob', errors)
      .isRequired()
      .isValidDate(this.dob)
      .isPastDate(this.dob)
      .isOlderThan(this.dob, CHILD_MAXIMUM_AGE)

    FieldValidator(this.childRelationship, 'child-relationship', errors)
      .isRequired()

    var validationErrors = errors.get()
    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = AboutChild
