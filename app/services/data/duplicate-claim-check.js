const config = require('../../../knexfile').extweb
const knex = require('knex')(config)

module.exports = function (reference, eligibilityId, nationalInsuranceNumber) {
  return getPrisonNumber(eligibilityId)
    .then(function (prisonNumber) {
      return getReferencesForDuplicateCheck(prisonNumber, nationalInsuranceNumber)
        .then(function (references) {
          if (references && references.length > 0 &&
              (references.length > 1 || references[0] !== reference)) {
            return true
          }
          return false
        })
    })
}

function getPrisonNumber (eligibilityId) {
  return knex('Prisoner').where('EligibilityId', eligibilityId).first('PrisonNumber')
    .then(function (result) {
      return result.PrisonNumber
    })
}

function getReferencesForDuplicateCheck (prisonNumber, nationalInsuranceNumber) {
  return knex.raw('SELECT * FROM [IntSchema].[getReferencesForDuplicateCheck] (?, ?)', [prisonNumber, nationalInsuranceNumber])
    .then(function (results) {
      const references = []

      results.forEach(function (result) { references.push(result.Reference) })

      return references
    })
}
