const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const moment = require('moment')
const AboutYou = require('../domain/about-you')

module.exports = function (reference, aboutYou) {
  if (!(aboutYou instanceof AboutYou)) {
    throw new Error('Provided aboutYou object is not an instance of the expected class')
  }

  var dateOfBirth = moment(aboutYou.dob).toDate()

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
    Benefit: aboutYou.benefit
  })
}
