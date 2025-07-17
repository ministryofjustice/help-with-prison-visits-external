const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (reference, eligibilityId, nationalInsuranceNumber) => {
  return getPrisonNumber(eligibilityId).then(prisonNumber => {
    return getReferencesForDuplicateCheck(prisonNumber, nationalInsuranceNumber).then(references => {
      if (references && references.length > 0 && (references.length > 1 || references[0] !== reference)) {
        return true
      }
      return false
    })
  })
}

function getPrisonNumber(eligibilityId) {
  const db = getDatabaseConnector()

  return db('Prisoner')
    .where('EligibilityId', eligibilityId)
    .first('PrisonNumber')
    .then(result => {
      return result.PrisonNumber
    })
}

function getReferencesForDuplicateCheck(prisonNumber, nationalInsuranceNumber) {
  const db = getDatabaseConnector()

  return db
    .raw('SELECT * FROM [IntSchema].[getReferencesForDuplicateCheck] (?, ?)', [prisonNumber, nationalInsuranceNumber])
    .then(results => {
      const references = []

      results.forEach(result => {
        references.push(result.Reference)
      })

      return references
    })
}
