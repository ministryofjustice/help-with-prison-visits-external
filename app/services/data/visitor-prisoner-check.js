const config = require('../../../knexfile').extweb
var Promise = require('bluebird').Promise
const knex = require('knex')(config)
const dateFormatter = require('../date-formatter')

module.exports = function (day, month, year, eligibilityId) {
  var matched

  return new Promise(function (resolve, reject) {
    getPrisonNumber(eligibilityId)
    .then(function (prisonNumber) {
      getEligibilityIds(day, month, year)
      .then(function (eligibilityIds) {
        getPrisonNumberFromEligibilityId(eligibilityIds)
        .then(function (prisonNumbers) {
          prisonNumbers.forEach(function (number) {
            if (number === prisonNumber) {
              matched = true
              return resolve(matched)
            } else {
              matched = false
            }
          })
          return resolve(matched)
        })
      })
    })
  })
}

function getPrisonNumber (eligibilityId) {
  return knex('Prisoner').where('EligibilityId', eligibilityId).first('PrisonNumber')
    .then(function (result) {
      return result.PrisonNumber
    })
}

function getEligibilityIds (day, month, year) {
  var dateOfJourney = dateFormatter.buildFormatted(day, month, year)

  return knex.raw(`SELECT * FROM [IntSchema].[getIdsForVisitorPrisonerCheck] (?)`, [ dateOfJourney ])
    .then(function (results) {
      var eligibilityIds = []

      results.forEach(function (result) {
        eligibilityIds.push(result.EligibilityId)
      })

      return eligibilityIds
    })
}

function getPrisonNumberFromEligibilityId (eligibilityIds) {
  return knex('IntSchema.Prisoner').whereIn('EligibilityId', eligibilityIds).select('PrisonNumber')
    .then(function (results) {
      var prisonNumbers = []

      results.forEach(function (result) {
        prisonNumbers.push(result.PrisonNumber)
      })

      return prisonNumbers
    })
}
