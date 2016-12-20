const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')
const unsafeInputPattern = new RegExp(/>|<|&lt|&gt/g)

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
      .isRequired()
      .isRange(1, 100)

    FieldValidator(this.lastName, 'LastName', errors)
      .isRequired()
      .isRange(1, 100)

    FieldValidator(this.nationalInsuranceNumber, 'NationalInsuranceNumber', errors)
      .isRequired()
      .isNationalInsuranceNumber()

    FieldValidator(this.houseNumberAndStreet, 'HouseNumberAndStreet', errors)
      .isRequired()
      .isRange(1, 200)

    FieldValidator(this.town, 'Town', errors)
      .isRequired()
      .isRange(3, 100)

    FieldValidator(this.county, 'County', errors)
      .isRequired('dropbox')
      .isRange(4, 100)

    FieldValidator(this.postCode, 'PostCode', errors)
      .isRequired()
      .isPostcode()

    FieldValidator(this.country, 'Country', errors)
      .isRequired()

    FieldValidator(this.emailAddress, 'EmailAddress', errors)
      .isRequired()
      .isRange(1, 100)
      .isEmail()

    FieldValidator(this.phoneNumber, 'PhoneNumber', errors)
      .isRange(0, 20)

    var validationErrors = errors.get()

    if (validationErrors) {
      throw new ValidationError(validationErrors)
    }
  }
}

module.exports = AboutYou
