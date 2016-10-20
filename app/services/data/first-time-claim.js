var config = require('../../../knexfile').extweb
var knex = require('knex')(config)
var eligibilityStatus = require('./reference-data/eligibility-status')
var referenceGenerator = require('../reference-generator')
var dateFormatter = require('../date-formatter')
var moment = require('moment')

var getUniqueReference = function () {
  return referenceGenerator.generate()
}

var insertNewEligibilityAndPrisoner = function (prisonerData) {
  var reference = getUniqueReference()
  // TODO change to avoid transaction as Tedious currently does not support multiple connections to MSSQL with transactions
  return knex.transaction(function (trx) {
    return trx
      .insert({
        Reference: reference,
        DateCreated: moment().toDate(),
        Status: eligibilityStatus.IN_PROGRESS
      })
      .into('Eligibility')
      .then(function () {
        // dateFormatter.build returns a moment, create new Date to store in database
        prisonerData.dateOfBirth = new Date(dateFormatter.build(prisonerData['dob-day'], prisonerData['dob-month'], prisonerData['dob-year']))

        // TODO add trim strings ala visitor and tests on trim + dob
        // TODO change fields to Pascal case and update view/tests ala visitor so they are consistent
        return trx.insert({
          Reference: reference,
          FirstName: prisonerData.firstName,
          LastName: prisonerData.lastName,
          DateOfBirth: prisonerData.dateOfBirth,
          PrisonNumber: prisonerData.prisonerNumber,
          NameOfPrison: prisonerData.nameOfPrison
        })
        .into('Prisoner')
      })
      .then(function () {
        return reference
      })
  })
}

module.exports = {
  getUniqueReference: getUniqueReference,
  insertNewEligibilityAndPrisoner: insertNewEligibilityAndPrisoner
}
