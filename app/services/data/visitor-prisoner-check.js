const { getDatabaseConnector } = require('../../databaseConnector')
const dateFormatter = require('../date-formatter')

module.exports = (day, month, year, eligibilityId) => {
  let matched

  return new Promise(resolve => {
    getPrisonNumber(eligibilityId).then(prisonNumber => {
      getEligibilityIds(day, month, year).then(eligibilityIds => {
        getPrisonNumberFromEligibilityId(eligibilityIds).then(prisonNumbers => {
          prisonNumbers.forEach(number => {
            if (number === prisonNumber) {
              matched = true
              return resolve(matched)
            }
            matched = false
            return resolve()
          })
          return resolve(matched)
        })
      })
    })
  })
}

function getPrisonNumber(eligibilityId) {
  const db = getDatabaseConnector()

  return db('Prisoner')
    .where('EligibilityId', eligibilityId)
    .first('PrisonNumber')
    .then(result => {
      try {
        return result.PrisonNumber
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        return result
      }
    })
}

function getEligibilityIds(day, month, year) {
  const dateOfJourney = dateFormatter.buildFormatted(day, month, year)
  const db = getDatabaseConnector()

  return db.raw('SELECT * FROM [IntSchema].[getIdsForVisitorPrisonerCheck] (?)', [dateOfJourney]).then(results => {
    const eligibilityIds = []

    results.forEach(result => {
      eligibilityIds.push(result.EligibilityId)
    })

    return eligibilityIds
  })
}

function getPrisonNumberFromEligibilityId(eligibilityIds) {
  const db = getDatabaseConnector()

  return db('IntSchema.Prisoner')
    .whereIn('EligibilityId', eligibilityIds)
    .select('PrisonNumber')
    .then(results => {
      const prisonNumbers = []

      results.forEach(result => {
        prisonNumbers.push(result.PrisonNumber)
      })

      return prisonNumbers
    })
}
