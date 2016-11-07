const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const eligibilityStatusEnum = require('../../constants/eligibility-status-enum')
const referenceGenerator = require('../reference-generator')
const moment = require('moment')

module.exports = function (aboutThePrisoner) {
  var reference = referenceGenerator.generate()

  return knex('Eligibility')
    .where('Reference', reference)
    .count('Reference as ReferenceCount')
    .then(function (countResult) {
      var count = countResult[ 0 ].ReferenceCount
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
          return knex.insert({
            Reference: uniqueReference,
            FirstName: aboutThePrisoner.firstName,
            LastName: aboutThePrisoner.lastName,
            DateOfBirth: aboutThePrisoner.dob,
            PrisonNumber: aboutThePrisoner.prisonerNumber,
            NameOfPrison: aboutThePrisoner.nameOfPrison
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
