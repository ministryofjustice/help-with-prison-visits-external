const config = require('../../../knexfile').extweb
const knex = require('knex')(config)
const EligibleChild = require('../domain/eligible-child')

module.exports = function (child, reference, eligibilityId) {
  if (!(child instanceof EligibleChild)) {
    throw new Error('Provided eligibleChild object is not an instance of the expected class')
  }

  var eligibleChild = {
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
  .where('Reference', reference)
  .count('Reference as ReferenceCount')
  .then(function (countResult) {
    var count = countResult[ 0 ].ReferenceCount

    if (count === 0) {
      return knex('EligibleChild')
      .insert(eligibleChild)
    } else {
      return knex('EligibleChild')
      .where('Reference', reference)
      .update(eligibleChild)
    }
  })
}
