const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const FieldsetValidator = require('../validators/fieldset-validator')
const dateFormatter = require('../date-formatter')
const ErrorHandler = require('../validators/error-handler')

const unsafeInputPattern = />|<|&lt|&gt/g
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class EligibleChild {
  constructor(
    firstName,
    lastName,
    childRelationship,
    dobDay,
    dobMonth,
    dobYear,
    parentFirstName,
    parentLastName,
    houseNumberAndStreet,
    town,
    county,
    postCode,
    country,
  ) {
    this.childRelationship = childRelationship
    this.dobDay = dobDay
    this.dobMonth = dobMonth
    this.dobYear = dobYear

    this.firstName = firstName ? firstName.replace(unsafeInputPattern, '').trim() : ''
    this.lastName = lastName ? lastName.replace(unsafeInputPattern, '').trim() : ''
    this.parentFirstName = parentFirstName ? parentFirstName.replace(unsafeInputPattern, '').trim() : ''
    this.parentLastName = parentLastName ? parentLastName.replace(unsafeInputPattern, '').trim() : ''
    this.houseNumberAndStreet = houseNumberAndStreet ? houseNumberAndStreet.replace(unsafeInputPattern, '').trim() : ''
    this.town = town ? town.replace(unsafeInputPattern, '').trim() : ''
    this.county = county ? county.replace(unsafeInputPattern, '').trim() : ''
    this.postCode = postCode ? postCode.replace(/ /g, '').toUpperCase() : ''
    this.country = country ? country.replace(unsafeInputPattern, '').trim() : ''

    this.IsValid()
  }

  IsValid() {
    const errors = ErrorHandler()

    FieldValidator(this.firstName, 'FirstName', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourFirstName)
      .isLessThanLength(100, ERROR_MESSAGES.getClaimantNameLessThanLengthMessage)

    FieldValidator(this.lastName, 'LastName', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourLastName)
      .isLessThanLength(100, ERROR_MESSAGES.getClaimantNameLessThanLengthMessage)

    const dobFields = [this.dobDay, this.dobMonth, this.dobYear]

    const dob = dateFormatter.build(this.dobDay, this.dobMonth, this.dobYear)

    FieldsetValidator(dobFields, 'dob', errors)
      .isRequired(ERROR_MESSAGES.getEnterPrisonerDateOfBirth)
      .isValidDate(dob)
      .isPastDate(dob)

    FieldValidator(this.parentFirstName, 'ParentFirstName', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourFirstName)
      .isLessThanLength(100, ERROR_MESSAGES.getClaimantNameLessThanLengthMessage)

    FieldValidator(this.parentLastName, 'ParentLastName', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourLastName)
      .isLessThanLength(100, ERROR_MESSAGES.getClaimantNameLessThanLengthMessage)

    FieldValidator(this.houseNumberAndStreet, 'HouseNumberAndStreet', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourHouseNumber)
      .isLessThanLength(200)

    FieldValidator(this.town, 'Town', errors).isRequired(ERROR_MESSAGES.getEnterYourTown).isRange(3, 100)

    FieldValidator(this.county, 'County', errors).isRequired(ERROR_MESSAGES.getEnterYourCounty).isRange(4, 100)

    FieldValidator(this.postCode, 'PostCode', errors).isRequired(ERROR_MESSAGES.getEnterYourPostcode).isPostcode()

    FieldValidator(this.country, 'Country', errors).isRequired(ERROR_MESSAGES.getSelectACountry)

    const validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }

    this.dob = dob.format('YYYY-MM-DD')
  }
}

module.exports = EligibleChild
