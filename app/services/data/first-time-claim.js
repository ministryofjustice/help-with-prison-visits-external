var config = require('../../../knexfile').extweb
var knex = require('knex')(config)
var eligibilityStatus = require('./reference-data/eligibility-status')
var referenceGenerator = require('../reference-generator')

var getUniqueReference = function () {
  return referenceGenerator.generate()
}

var insertNewEligibilityAndPrisoner = function (prisonerData) {
  var reference = getUniqueReference()

  return knex.transaction(function (trx) {
    return trx
      .insert({
        Reference: reference,
        DateCreated: new Date(),
        Status: eligibilityStatus.IN_PROGRESS
      })
      .into('Eligibility')
      .then(function () {
        // TODO refactor to common date parser
        prisonerData.dateOfBirth = new Date(`${prisonerData['dob-year']}-${prisonerData['dob-month']}-${prisonerData['dob-day']}`)

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
