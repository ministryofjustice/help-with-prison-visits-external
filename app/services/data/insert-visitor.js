const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const moment = require('moment')
const benefitsEnum = require('../../constants/benefits-enum')

module.exports = function (reference, visitorData) {
  var dateOfBirth = moment(visitorData.DateOfBirth).toDate()
  var requireBenefitUpload = true

  if (benefitsEnum[visitorData.Benefit]) {
    requireBenefitUpload = benefitsEnum[visitorData.Benefit].requireBenefitUpload
  }

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
    RequireBenefitUpload: requireBenefitUpload,
    Benefit: visitorData.Benefit
  })
}
