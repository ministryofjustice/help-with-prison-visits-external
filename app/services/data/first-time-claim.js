var config = require('../../../knexfile').extweb
var knex = require('knex')(config)
var eligibilityStatusEnum = require('../../constants/eligibility-status-enum')
var referenceGenerator = require('../reference-generator')
var dateFormatter = require('../date-formatter')
var moment = require('moment')

module.exports.insertNewEligibilityAndPrisoner = function (prisonerData) {
  var reference = referenceGenerator.generate()

  return knex('Eligibility').where('Reference', reference).count('Reference as ReferenceCount')
  .then(function (countResult) {
    var count = countResult[0].ReferenceCount
    if (count > 0) {
      // odds of two references in a row being non-unique 1x10e21
      reference = referenceGenerator.generate()
    }
    return reference
  })
  .then(function (uniqueReference) {
    return knex.insert({
      Reference: uniqueReference,
      DateCreated: moment().toDate(),
      Status: eligibilityStatusEnum.IN_PROGRESS
    })
    .into('Eligibility')
    .then(function () {
      var dateOfBirth = dateFormatter.build(prisonerData['dob-day'], prisonerData['dob-month'], prisonerData['dob-year']).toDate()

      return knex.insert({
        Reference: uniqueReference,
        FirstName: prisonerData.FirstName.trim(),
        LastName: prisonerData.LastName.trim(),
        DateOfBirth: dateOfBirth,
        PrisonNumber: prisonerData.PrisonerNumber.replace(/ /g, '').toUpperCase(),
        NameOfPrison: prisonerData.NameOfPrison.trim()
      })
      .into('Prisoner')
      .then(function () {
        return uniqueReference
      })
      .catch(function (error) {
        // Will leave orphaned Eligibility but will be cleaned up by worker
        throw error
      })
    })
  })
}
