var FieldValidator = require('../field-validator')

class AboutYouValidator {
  static validate (data) {
    var errors = {}

    var title = data['Title']
    var firstName = data['FirstName']
    var lastName = data['LastName']
    var nationalInsuranceNumber = data['NationalInsuranceNumber']
    var houseNumberAndStreet = data['HouseNumberAndStreet']
    var town = data['Town']
    var county = data['County']
    var postcode = data['PostCode']
    var country = data['Country']
    var emailAddress = data['EmailAddress']
    var phoneNumber = data['PhoneNumber']

    FieldValidator(title, 'Title', errors)
      .isRequired()
      .isAlpha()
      .isRange(2, 4)

    FieldValidator(firstName, 'FirstName', errors)
      .isRequired()
      .isRange(1, 100)

    FieldValidator(lastName, 'LastName', errors)
      .isRequired()
      .isRange(1, 100)

    FieldValidator(nationalInsuranceNumber, 'NationalInsuranceNumber', errors)
      .isRequired()
      .isNationalInsuranceNumber()

    FieldValidator(houseNumberAndStreet, 'HouseNumberAndStreet', errors)
      .isRequired()
      .isRange(1, 200)

    FieldValidator(town, 'Town', errors)
      .isRequired()
      .isAlpha()
      .isRange(3, 100)

    FieldValidator(county, 'County', errors)
      .isRequired('dropbox')
      .isAlpha()
      .isRange(4, 100)

    FieldValidator(postcode, 'PostCode', errors)
      .isRequired()
      .isPostcode()

    FieldValidator(country, 'Country', errors)
      .isRequired('dropbox')

    FieldValidator(emailAddress, 'EmailAddress', errors)
      .isRange(1, 100)

    FieldValidator(phoneNumber, 'PhoneNumber', errors)
      .isRange(0, 13)

   return errors.get()
}
module.exports = function (data) {
  return AboutYouValidator.validate(data)
}
