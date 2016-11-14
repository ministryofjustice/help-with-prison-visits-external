const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const AboutChild = require('../domain/about-child')

module.exports = function (reference, eligibilityId, claimId, aboutChild) {
  if (!(aboutChild instanceof AboutChild)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  return knex('ClaimChild').insert({
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimId: claimId,
    Name: aboutChild.childName,
    DateOfBirth: aboutChild.dob.toDate(),
    Relationship: aboutChild.childRelationship,
    IsEnabled: true
  })
}
