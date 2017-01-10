const config = require('../../../../knexfile').migrations
const knex = require('knex')(config)
const childRelationshipEnum = require('../../../../app/constants/child-relationship-enum')
const dateFormatter = require('../../../../app/services/date-formatter')

module.exports.CLAIM_CHILD_ID = Math.floor(Date.now() / 100) - 14000000000
module.exports.FIRST_NAME = 'Joe'
module.exports.LAST_NAME = 'Bloggs'
module.exports.DAY = '15'
module.exports.MONTH = '05'
module.exports.YEAR = '2014'
module.exports.CHILD_RELATIONSHIP = childRelationshipEnum.PRISONER_CHILD
module.exports.DOB = dateFormatter.build(this.DAY, this.MONTH, this.YEAR)

module.exports.build = function () {
  return {
    ClaimChildId: this.CLAIM_CHILD_ID,
    FirstName: this.FIRST_NAME,
    LastName: this.LAST_NAME,
    DateOfBirth: this.DOB.toDate(),
    Relationship: this.CHILD_RELATIONSHIP,
    IsEnabled: true
  }
}

module.exports.insert = function (reference, eligibilityId, claimId, data) {
  var child = data || this.build()

  return knex('IntSchema.ClaimChild').insert({
    ClaimChildId: child.ClaimChildId,
    ClaimId: claimId,
    EligibilityId: eligibilityId,
    Reference: reference,
    FirstName: child.FirstName,
    LastName: child.LastName,
    DateOfBirth: child.DateOfBirth,
    Relationship: child.Relationship,
    IsEnabled: child.IsEnabled
  })
}

module.exports.get = function (claimId) {
  return knex.first()
    .from('IntSchema.ClaimChild')
    .where('ClaimId', claimId)
}

module.exports.delete = function (claimId) {
  return knex('IntSchema.ClaimChild')
    .where('ClaimId', claimId)
    .del()
}
