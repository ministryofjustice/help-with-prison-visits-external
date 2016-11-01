const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const moment = require('moment')
const relationshipEnum = require('../../../../app/constants/prisoner-relationships-enum')

module.exports.TITLE = 'Mr'
module.exports.FIRST_NAME = 'John'
module.exports.LAST_NAME = 'Smith'
module.exports.NATIONAL_INSURANCE_NUMBER = 'BN180518D'
module.exports.HOUSE_NUMBER_AND_STREET = '123 Street'
module.exports.TOWN = 'Belfast'
module.exports.COUNTY = 'Antrim'
module.exports.POST_CODE = 'BT137RT'
module.exports.COUNTRY = 'United Kingdom'
module.exports.EMAIL_ADDRESS = 'john.smith@gmail.com'
module.exports.PHONE_NUMBER = '02153245564'
module.exports.DATE_OF_BIRTH = moment().toDate()
module.exports.RELATIONSHIP = relationshipEnum[0]
module.exports.JOURNEY_ASSISTANCE = 'yes'
module.exports.REQURE_BENEFIT_UPLOAD = false

module.exports.insert = function (reference) {
  return knex('ExtSchema.Visitor')
    .insert({
      Reference: reference,
      Title: this.TITLE,
      FirstName: this.FIRST_NAME,
      LastName: this.LAST_NAME,
      NationalInsuranceNumber: this.NATIONAL_INSURANCE_NUMBER,
      HouseNumberAndStreet: this.HOUSE_NUMBER_AND_STREET,
      Town: this.TOWN,
      County: this.COUNTY,
      PostCode: this.POST_CODE,
      Country: this.COUNTRY,
      EmailAddress: this.EMAIL_ADDRESS,
      PhoneNumber: this.PHONE_NUMBER,
      DateOfBirth: this.DATE_OF_BIRTH,
      Relationship: this.RELATIONSHIP,
      JourneyAssistance: this.JOURNEY_ASSISTANCE,
      RequireBenefitUpload: this.REQURE_BENEFIT_UPLOAD
    })
}

module.exports.delete = function (reference) {
  return knex('ExtSchema.Visitor')
    .where('Reference', reference)
    .del()
}
