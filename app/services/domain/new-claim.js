const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const ERROR_MESSAGES = require('../validators/validation-error-messages')
const MaxDaysAfterVisit = require('../../../config').MAX_DAYS_AFTER_RETROSPECTIVE_CLAIM
const MaxDaysBeforeVisit = require('../../../config').MAX_DAYS_BEFORE_ADVANCE_CLAIM

class NewClaim {
  constructor(reference, day, month, year, isAdvanceClaim, releaseDateIsSet, releaseDate) {
    this.reference = reference
    this.fields = [day, month, year]
    this.dateOfJourney = dateFormatter.build(day, month, year)
    this.isAdvanceClaim = isAdvanceClaim
    this.releaseDateIsSet = releaseDateIsSet
    this.releaseDate = releaseDate
    this.IsValid()
  }

  IsValid() {
    const errors = ErrorHandler()

    FieldValidator(this.reference, 'Reference', errors).isRequired()

    if (!this.isAdvanceClaim) {
      FieldsetValidator(this.fields, 'DateOfJourney', errors)
        .isRequired(ERROR_MESSAGES.getEnterDateOfVisit)
        .isValidDate(this.dateOfJourney)
        .isPastDate(this.dateOfJourney)
        .isDateWithinDays(this.dateOfJourney, parseInt(MaxDaysAfterVisit, 10), this.isAdvanceClaim)
      // .isVisitDateBeforeReleaseDate(this.dateOfJourney, this.releaseDateIsSet, this.releaseDate)
    } else {
      FieldsetValidator(this.fields, 'DateOfJourney', errors)
        .isRequired(ERROR_MESSAGES.getEnterDateOfVisit)
        .isValidDate(this.dateOfJourney)
        .isFutureDate(this.dateOfJourney)
        .isDateWithinDays(this.dateOfJourney, parseInt(MaxDaysBeforeVisit, 10), this.isAdvanceClaim)
        .isNotDateWithinDays(this.dateOfJourney, 5)
      // .isVisitDateBeforeReleaseDate(this.dateOfJourney, this.releaseDateIsSet, this.releaseDate)
    }

    const validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = NewClaim
