const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const AboutChild = require('../domain/about-child')

module.exports = function (reference, eligibilityId, claimId, child) {
  if (!(child instanceof AboutChild)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  return knex('ClaimChild').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimId: claimId,
    FirstName: child.firstName,
    LastName: child.lastName,
    DateOfBirth: child.dob.toDate(),
    Relationship: child.childRelationship,
    IsEnabled: true
  })
}
