const { getDatabaseConnector } = require('../../databaseConnector')
const BenefitOwner = require('../domain/benefit-owner')

module.exports = (reference, eligibilityId, benefitOwner) => {
  if (!(benefitOwner instanceof BenefitOwner)) {
    throw new Error('Provided benefitOwner object is not an instance of the expected class')
  }

  const db = getDatabaseConnector()
  const benefitInformation = {
    EligibilityId: eligibilityId,
    Reference: reference,
    FirstName: benefitOwner.firstName,
    LastName: benefitOwner.lastName,
    NationalInsuranceNumber: benefitOwner.nationalInsuranceNumber,
    DateOfBirth: benefitOwner.dob,
  }

  return db('Benefit')
    .where('Reference', reference)
    .count('Reference as ReferenceCount')
    .then(countResult => {
      const count = countResult[0].ReferenceCount

      if (count === 0) {
        return db('Benefit').insert(benefitInformation)
      }
      return db('Benefit').where('Reference', reference).update(benefitInformation)
    })
}
