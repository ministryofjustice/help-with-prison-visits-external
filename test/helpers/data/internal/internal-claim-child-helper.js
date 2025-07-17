const { getDatabaseConnector } = require('../../../../app/databaseConnector')
const childRelationshipEnum = require('../../../../app/constants/child-relationship-enum')
const dateFormatter = require('../../../../app/services/date-formatter')

module.exports.CLAIM_CHILD_ID = Math.floor(Date.now() / 100) - 15000000000
module.exports.FIRST_NAME = 'Joe'
module.exports.LAST_NAME = 'Bloggs'
module.exports.DAY = '15'
module.exports.MONTH = '05'
module.exports.YEAR = '2014'
module.exports.CHILD_RELATIONSHIP = childRelationshipEnum.PRISONER_CHILD
module.exports.DOB = dateFormatter.build(this.DAY, this.MONTH, this.YEAR)

module.exports.build = () => {
  return {
    ClaimChildId: this.CLAIM_CHILD_ID,
    FirstName: this.FIRST_NAME,
    LastName: this.LAST_NAME,
    DateOfBirth: this.DOB.format('YYYY-MM-DD'),
    Relationship: this.CHILD_RELATIONSHIP,
    IsEnabled: true,
  }
}

module.exports.insert = (reference, eligibilityId, claimId, data) => {
  const child = data || this.build()
  const db = getDatabaseConnector()

  return db('IntSchema.ClaimChild').insert({
    ClaimChildId: child.ClaimChildId,
    ClaimId: claimId,
    EligibilityId: eligibilityId,
    Reference: reference,
    FirstName: child.FirstName,
    LastName: child.LastName,
    DateOfBirth: child.DateOfBirth,
    Relationship: child.Relationship,
    IsEnabled: child.IsEnabled,
  })
}

module.exports.get = claimId => {
  const db = getDatabaseConnector()

  return db.first().from('IntSchema.ClaimChild').where('ClaimId', claimId)
}

module.exports.delete = claimId => {
  const db = getDatabaseConnector()

  return db('IntSchema.ClaimChild').where('ClaimId', claimId).del()
}
