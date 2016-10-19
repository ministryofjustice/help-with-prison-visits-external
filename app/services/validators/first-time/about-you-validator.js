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
      .isLength(2, 4)

    FieldValidator(firstName, 'FirstName', errors)
      .isRequired()
      .isLength(1, 100)

    FieldValidator(lastName, 'LastName', errors)
      .isRequired()
      .isLength(1, 100)

    FieldValidator(nationalInsuranceNumber, 'NationalInsuranceNumber', errors)
      .isRequired()
      .isNationalInsuranceNumber()

    FieldValidator(houseNumberAndStreet, 'HouseNumberAndStreet', errors)
      .isRequired()
      .isLength(1, 200)

    FieldValidator(town, 'Town', errors)
      .isRequired()
      .isAlpha()
      .isLength(3, 100)

    FieldValidator(county, 'County', errors)
      .isRequired('dropbox')
      .isAlpha()
      .isLength(4, 100)

    FieldValidator(postcode, 'PostCode', errors)
      .isRequired()
      .isPostcode()

    FieldValidator(country, 'Country', errors)
      .isRequired('dropbox')

    FieldValidator(emailAddress, 'EmailAddress', errors)
      .isLength(1, 100)

    FieldValidator(phoneNumber, 'PhoneNumber', errors)
      .isLength(0, 13)

    for (var field in errors) {
      if (errors.hasOwnProperty(field)) {
        if (errors[field].length > 0) { return errors }
      }
    }
    return false
  }
}
exports.default = function (data) {
  return AboutYouValidator.validate(data)
}
module.exports = exports['default']
