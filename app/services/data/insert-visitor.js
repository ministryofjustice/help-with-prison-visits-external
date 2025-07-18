const { getDatabaseConnector } = require('../../databaseConnector')
const AboutYou = require('../domain/about-you')

module.exports = (reference, eligibilityId, aboutYou) => {
  if (!(aboutYou instanceof AboutYou)) {
    throw new Error('Provided aboutYou object is not an instance of the expected class')
  }

  const dateOfBirth = aboutYou.dob.format('YYYY-MM-DD')
  const db = getDatabaseConnector()

  const visitorInformation = {
    EligibilityId: eligibilityId,
    Reference: reference,
    FirstName: aboutYou.firstName,
    LastName: aboutYou.lastName,
    NationalInsuranceNumber: aboutYou.nationalInsuranceNumber,
    HouseNumberAndStreet: aboutYou.houseNumberAndStreet,
    Town: aboutYou.town,
    County: aboutYou.county,
    PostCode: aboutYou.postCode,
    Country: aboutYou.country,
    EmailAddress: aboutYou.emailAddress,
    PhoneNumber: aboutYou.phoneNumber,
    DateOfBirth: dateOfBirth,
    Relationship: aboutYou.relationship,
    Benefit: aboutYou.benefit,
    BenefitOwner: aboutYou.benefitOwner,
  }

  return db('Visitor')
    .where('Reference', reference)
    .count('Reference as ReferenceCount')
    .then(countResult => {
      const count = countResult[0].ReferenceCount

      if (count === 0) {
        return db('Visitor').insert(visitorInformation)
      }
      return db('Visitor').where('Reference', reference).update(visitorInformation)
    })
}
