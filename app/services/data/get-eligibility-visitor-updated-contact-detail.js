const { getDatabaseConnector } = require('../../databaseConnector')

module.exports = function (reference, eligibilityId) {
  const db = getDatabaseConnector()

  return db('EligibilityVisitorUpdateContactDetail')
    .first('EmailAddress', 'PhoneNumber')
    .where({ Reference: reference, EligibilityId: eligibilityId })
    .orderBy('DateSubmitted', 'desc')
}
