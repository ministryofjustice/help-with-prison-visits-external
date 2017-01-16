const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const AboutEscort = require('../domain/about-escort')

module.exports = function (reference, eligibilityId, claimId, aboutEscort) {
  if (!(aboutEscort instanceof AboutEscort)) {
    throw new Error('Provided object is not an instance of the expected class')
  }

  return knex('ClaimEscort').where({
    EligibilityId: eligibilityId,
    Reference: reference,
    ClaimId: claimId
  })
  .update({'IsEnabled': false})
  .then(function () {
    return knex('ClaimEscort').insert({
      EligibilityId: eligibilityId,
      Reference: reference,
      ClaimId: claimId,
      FirstName: aboutEscort.firstName,
      LastName: aboutEscort.lastName,
      DateOfBirth: aboutEscort.dob.toDate(),
      NationalInsuranceNumber: aboutEscort.nationalInsuranceNumber,
      IsEnabled: true
    })
  })
}
