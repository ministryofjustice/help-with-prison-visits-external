const ValidationError = require('../errors/validation-error')
const FieldValidator = require('../validators/field-validator')
const ErrorHandler = require('../validators/error-handler')
const dateFormatter = require('../date-formatter')

class AboutYou {
  constructor (dob, relationship, benefit, title, firstName, lastName,
    nationalInsuranceNumber, houseNumberAndStreet, town, county, postCode,
    country, emailAddress, phoneNumber) {
    this.dob = dateFormatter.buildFromDateString(dob)
    this.relationship = relationship
    this.benefit = benefit

    this.title = title ? title.trim() : ''
    this.firstName = firstName ? firstName.trim() : ''
    this.lastName = lastName ? lastName.trim() : ''
    this.nationalInsuranceNumber = nationalInsuranceNumber ? nationalInsuranceNumber.replace(/ /g, '').toUpperCase() : ''
    this.houseNumberAndStreet = houseNumberAndStreet ? houseNumberAndStreet.trim() : ''
    this.town = town ? town.trim() : ''
    this.county = county ? county.trim() : ''
    this.postCode = postCode ? postCode.replace(/ /g, '').toUpperCase() : ''
    this.country = country ? country.trim() : ''
    this.emailAddress = emailAddress ? emailAddress.trim() : ''
    this.phoneNumber = phoneNumber ? phoneNumber.trim() : ''

    this.IsValid()
  }

  IsValid () {
    var errors = ErrorHandler()

    FieldValidator(this.title, 'Title', errors)
      .isRequired()
      .isAlpha()
      .isRange(2, 4)

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
