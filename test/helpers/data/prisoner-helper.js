const config = require('../../../knexfile').migrations
const knex = require('knex')(config)
const dateFormatter = require('../../../app/services/date-formatter')

module.exports.FIRST_NAME = 'John'
module.exports.LAST_NAME = 'Smith'
module.exports.DATE_OF_BIRTH = dateFormatter.now().toDate()
module.exports.PRISON_NUMBER = '0123456789'
module.exports.NAME_OF_PRISON = 'Hewell'

module.exports.insert = function (reference) {
  return knex('ExtSchema.Prisoner')
    .insert({
      Reference: reference,
      FirstName: this.FIRST_NAME,
      LastName: this.LAST_NAME,
      DateOfBirth: this.DATE_OF_BIRTH,
      PrisonNumber: this.PRISON_NUMBER,
      NameOfPrison: this.NAME_OF_PRISON
    })
}

module.exports.get = function (reference) {
  return knex.first()
    .from('ExtSchema.Prisoner')
    .where('Reference', reference)
}

module.exports.delete = function (reference) {
  return knex('ExtSchema.Prisoner')
    .where('Reference', reference)
    .del()
}
