const { getDatabaseConnector } = require('../../databaseConnector')
const AboutEscort = require('../domain/about-escort')

module.exports = (reference, eligibilityId, claimId, aboutEscort) => {
  if (!(aboutEscort instanceof AboutEscort)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  const db = getDatabaseConnector()

  return db('ClaimEscort')
    .where({
      EligibilityId: eligibilityId,
      Reference: reference,
      ClaimId: claimId,
    })
    .update({ IsEnabled: false })
    .then(() => {
      return db('ClaimEscort').insert({
        EligibilityId: eligibilityId,
        Reference: reference,
        ClaimId: claimId,
        FirstName: aboutEscort.firstName,
        LastName: aboutEscort.lastName,
        DateOfBirth: aboutEscort.dob.format('YYYY-MM-DD'),
        IsEnabled: true,
      })
    })
}
