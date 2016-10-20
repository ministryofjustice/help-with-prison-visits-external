var config = require('../../../knexfile').extweb
var knex = require('knex')(config)
var moment = require('moment')

module.exports.insert = function (reference, visitorData) {
  var dateOfBirth = moment(visitorData.DateOfBirth).toDate()
  var requireBenefitUpload = visitorData === 'y'

  return knex('Visitor').insert({
    Reference: reference,
    Title: visitorData.Title.trim(),
    FirstName: visitorData.FirstName.trim(),
    LastName: visitorData.LastName.trim(),
    NationalInsuranceNumber: visitorData.NationalInsuranceNumber.replace(/ /g, '').toUpperCase(),
    HouseNumberAndStreet: visitorData.HouseNumberAndStreet.trim(),
    Town: visitorData.Town.trim(),
    County: visitorData.County.trim(),
    PostCode: visitorData.PostCode.replace(/ /g, '').toUpperCase(),
    Country: visitorData.Country.trim(),
    EmailAddress: visitorData.EmailAddress.trim(),
    PhoneNumber: visitorData.PhoneNumber.trim(),
    DateOfBirth: dateOfBirth,
    Relationship: visitorData.Relationship.trim(),
    JourneyAssistance: visitorData.JourneyAssistance,
    RequireBenefitUpload: requireBenefitUpload
  })
}
