const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const moment = require('moment')

// TODO rename file insert-visitor and change module to expose single function
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
    JourneyAssistance: 'no', // TODO remove from visitor
    RequireBenefitUpload: requireBenefitUpload
  })
}
