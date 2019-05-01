const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const BenefitAbout = require('../domain/benefit-about')

module.exports = function (reference, eligibilityId, benefitAbout) {
  if (!(benefitAbout instanceof BenefitAbout)) {
    throw new Error('Provided benefitAbout object is not an instance of the expected class')
  }

  var benefitInformation = {
    EligibilityId: eligibilityId,
    Reference: reference,
    FirstName: benefitAbout.firstName,
    LastName: benefitAbout.lastName,
    NationalInsuranceNumber: benefitAbout.nationalInsuranceNumber,
    DateOfBirth: benefitAbout.dob
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
