var config = require('../../../knexfile').extweb
var knex = require('knex')(config)
var eligibilityStatusEnum = require('../../constants/eligibility-status-enum')
var referenceGenerator = require('../reference-generator')
var dateFormatter = require('../date-formatter')

var getUniqueReference = function () {
  return referenceGenerator.generate()
}

var insertNewEligibilityAndPrisoner = function (prisonerData) {
  var reference = getUniqueReference()

  return knex.insert({
    Reference: reference,
    DateCreated: new Date(),
    Status: eligibilityStatusEnum.IN_PROGRESS
  })
  .into('Eligibility')
  .then(function () {
    var dateOfBirth = dateFormatter.build(prisonerData['dob-day'], prisonerData['dob-month'], prisonerData['dob-year'])

    return knex.insert({
      Reference: reference,
      FirstName: prisonerData.FirstName.trim(),
      LastName: prisonerData.LastName.trim(),
      DateOfBirth: dateOfBirth,
      PrisonNumber: prisonerData.PrisonerNumber.replace(/ /g, '').toUpperCase(),
      NameOfPrison: prisonerData.NameOfPrison.trim()
    })
    .into('Prisoner')
    .then(function () {
      return reference
    })
    .catch(function (error) {
      // Will leave orphaned Eligibility but will be cleaned up by worker
      throw error
    })
  })
}

module.exports = {
  getUniqueReference: getUniqueReference,
  insertNewEligibilityAndPrisoner: insertNewEligibilityAndPrisoner
}
