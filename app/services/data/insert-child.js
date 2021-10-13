const { getDatabaseConnector } = require('../../databaseConnector')
const AboutChild = require('../domain/about-child')

module.exports = function (reference, eligibilityId, claimId, child) {
  if (!(child instanceof AboutChild)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  const db = getDatabaseConnector()

  return db('ClaimChild').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimId: claimId,
    FirstName: child.firstName,
    LastName: child.lastName,
    DateOfBirth: child.dob.format('YYYY-MM-DD'),
    Relationship: child.childRelationship,
    IsEnabled: true
  })
}
