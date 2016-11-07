const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const benefitsEnum = require('../../constants/benefits-enum')
const AboutYou = require('../domain/about-you')

module.exports = function (reference, aboutYou) {
  if (!(aboutYou instanceof AboutYou)) {
    throw new Error('Provided aboutYou object is not an instance of the expected class')
  }

  var dateOfBirth = aboutYou.dob.toDate()
  var requireBenefitUpload = true

  if (benefitsEnum[aboutYou.benefit]) {
    requireBenefitUpload = benefitsEnum[aboutYou.benefit].requireBenefitUpload
  }

  return knex('Visitor').insert({
    Reference: reference,
    Title: aboutYou.title,
    FirstName: aboutYou.firstName,
    LastName: aboutYou.lastName,
    NationalInsuranceNumber: aboutYou.nationalInsuranceNumber,
    HouseNumberAndStreet: aboutYou.houseNumberAndStreet,
    Town: aboutYou.town,
    County: aboutYou.county,
    PostCode: aboutYou.postCode,
    Country: aboutYou.country,
    EmailAddress: aboutYou.emailAddress,
    PhoneNumber: aboutYou.phoneNumber,
    DateOfBirth: dateOfBirth,
    Relationship: aboutYou.relationship,
    JourneyAssistance: 'no', // TODO remove from visitor
    RequireBenefitUpload: requireBenefitUpload,
    Benefit: aboutYou.benefit
  })
}
