const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = (reference, dob, eligibilityId) => {
  const db = getDatabaseConnector()

  return db
    .raw('SELECT * FROM [IntSchema].[getMaskedEligibility] (?, ?, ?)', [reference, dob, eligibilityId])
    .then(result => {
      if (result && result.length > 0) {
        return result[0]
      }

      throw new Error('Could not find any valid Eligibility details')
    })
}
