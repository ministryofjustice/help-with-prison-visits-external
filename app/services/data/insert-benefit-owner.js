const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const BenefitOwner = require('../domain/benefit-owner')

module.exports = function (reference, eligibilityId, benefitOwner) {
  if (!(benefitOwner instanceof BenefitOwner)) {
    throw new Error('Provided benefitOwner object is not an instance of the expected class')
  }

  var benefitInformation = {
    EligibilityId: eligibilityId,
    Reference: reference,
    FirstName: benefitOwner.firstName,
    LastName: benefitOwner.lastName,
    NationalInsuranceNumber: benefitOwner.nationalInsuranceNumber,
    DateOfBirth: benefitOwner.dob
  }

  return knex('Benefit')
  .where('Reference', reference)
  .count('Reference as ReferenceCount')
  .then(function (countResult) {
    var count = countResult[ 0 ].ReferenceCount

    if (count === 0) {
      return knex('Benefit')
      .insert(benefitInformation)
    } else {
      return knex('Benefit')
      .where('Reference', reference)
      .update(benefitInformation)
    }
  })
}
