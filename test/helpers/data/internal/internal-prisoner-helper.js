const { getDatabaseConnector } = require('../../../../app/databaseConnector')
const dateFormatter = require('../../../../app/services/date-formatter')

module.exports.PRISONER_ID = Math.floor(Date.now() / 100) - 15000000000
module.exports.FIRST_NAME = 'John'
module.exports.LAST_NAME = 'Smith'
module.exports.DATE_OF_BIRTH = dateFormatter.now()
module.exports.PRISON_NUMBER = '0123456789'
module.exports.NAME_OF_PRISON = 'hewell'

module.exports.insert = function (reference, eligibilityId) {
  const db = getDatabaseConnector()

  return db('IntSchema.Prisoner')
    .insert({
      PrisonerId: this.PRISONER_ID,
      EligibilityId: eligibilityId,
      Reference: reference,
      FirstName: this.FIRST_NAME,
      LastName: this.LAST_NAME,
      DateOfBirth: this.DATE_OF_BIRTH.format('YYYY-MM-DD'),
      PrisonNumber: this.PRISON_NUMBER,
      NameOfPrison: this.NAME_OF_PRISON
    })
}

module.exports.get = function (reference) {
  const db = getDatabaseConnector()

  return db.first()
    .from('IntSchema.Prisoner')
    .where('Reference', reference)
}

module.exports.delete = function (reference) {
  const db = getDatabaseConnector()

  return db('IntSchema.Prisoner')
    .where('Reference', reference)
    .del()
}
