const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const EligibleChild = require('../domain/eligible-child')

module.exports = function (child, reference, eligibilityId) {
  if (!(child instanceof EligibleChild)) {
    throw new Error('Provided eligibleChild object is not an instance of the expected class')
  }

  const eligibleChild = {
    EligibilityId: eligibilityId,
    Reference: reference,
    FirstName: child.firstName,
    LastName: child.lastName,
    ChildRelationship: child.childRelationship,
    DateOfBirth: child.dob,
    ParentFirstName: child.parentFirstName,
    ParentLastName: child.parentLastName,
    HouseNumberAndStreet: child.houseNumberAndStreet,
    Town: child.town,
    County: child.county,
    PostCode: child.postCode,
    Country: child.country
  }

  return knex('EligibleChild')
    .insert(eligibleChild)
}
