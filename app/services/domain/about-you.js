const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)
const ERROR_MESSAGES = require('../validators/validation-error-messages')

class AboutYou {
  constructor (dob, relationship, benefit, firstName, lastName,
    nationalInsuranceNumber, houseNumberAndStreet, town, county, postCode,
    country, emailAddress, phoneNumber) {
    this.dob = dateFormatter.buildFromDateString(dob)
    this.relationship = relationship
    this.benefit = benefit

    this.firstName = firstName ? firstName.replace(unsafeInputPattern, '').trim() : ''
    this.lastName = lastName ? lastName.replace(unsafeInputPattern, '').trim() : ''
    this.nationalInsuranceNumber = nationalInsuranceNumber ? nationalInsuranceNumber.replace(/ /g, '').toUpperCase() : ''
    this.houseNumberAndStreet = houseNumberAndStreet ? houseNumberAndStreet.replace(unsafeInputPattern, '').trim() : ''
    this.town = town ? town.replace(unsafeInputPattern, '').trim() : ''
    this.county = county ? county.replace(unsafeInputPattern, '').trim() : ''
    this.postCode = postCode ? postCode.replace(/ /g, '').toUpperCase() : ''
    this.country = country ? country.replace(unsafeInputPattern, '').trim() : ''
    this.emailAddress = emailAddress ? emailAddress.trim() : ''
    this.phoneNumber = phoneNumber ? phoneNumber.replace(unsafeInputPattern, '').trim() : ''

    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.firstName, 'FirstName', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourFirstName)
      .isLessThanLength(100, ERROR_MESSAGES.getClaimantNameLessThanLengthMessage)

    FieldValidator(this.lastName, 'LastName', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourLastName)
      .isLessThanLength(100, ERROR_MESSAGES.getClaimantNameLessThanLengthMessage)

    FieldValidator(this.nationalInsuranceNumber, 'NationalInsuranceNumber', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourNINNumber)
      .isLength(9)
      .isNationalInsuranceNumber()

    FieldValidator(this.houseNumberAndStreet, 'HouseNumberAndStreet', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourHouseNumber)
      .isLessThanLength(200)

    FieldValidator(this.town, 'Town', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourTown)
      .isRange(3, 100)

    FieldValidator(this.county, 'County', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourCounty)
      .isRange(4, 100)

    FieldValidator(this.postCode, 'PostCode', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourPostcode)
      .isPostcode()

    FieldValidator(this.country, 'Country', errors)
      .isRequired(ERROR_MESSAGES.getSelectACountry)

    FieldValidator(this.emailAddress, 'EmailAddress', errors)
      .isRequired(ERROR_MESSAGES.getEnterYourEmailAddress)
      .isLessThanLength(100)
      .isEmail()

    FieldValidator(this.phoneNumber, 'PhoneNumber', errors)
      .isLessThanLength(20)

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = AboutYou
