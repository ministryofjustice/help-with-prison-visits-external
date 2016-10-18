var config = require('../../../knexfile').extweb
var knex = require('knex')(config)

module.exports.insert = function (reference, visitorData) {
  var dateOfBirth = new Date(visitorData.dateOfBirth)
  var requireBenefitUpload = visitorData === 'y'

  return knex('Visitor').insert({
    Reference: reference,
    Title: visitorData.title.trim(),
    FirstName: visitorData.firstName.trim(),
    LastName: visitorData.lastName.trim(),
    NationalInsuranceNumber: visitorData.nationalInsuranceNumber.replace(/ /g, '').toUpperCase(),
    HouseNumberAndStreet: visitorData.houseNumberAndStreet.trim(),
    County: visitorData.county.trim(),
    PostCode: visitorData.postCode.replace(/ /g, '').toUpperCase(),
    Country: visitorData.country.trim(),
    EmailAddress: visitorData.emailAddress.trim(),
    PhoneNumber: visitorData.phoneNumber.trim(),
    DateOfBirth: dateOfBirth,
    Relationship: visitorData.relationship.trim(),
    JourneyAssistance: visitorData.journeyAssistance,
    RequireBenefitUpload: requireBenefitUpload
  })
}
