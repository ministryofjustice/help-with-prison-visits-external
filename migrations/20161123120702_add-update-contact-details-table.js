exports.up = function (knex, Promise) {
  return knex.schema.createTable('UpdateContactDetails', function (table) {
    table.increments('UpdateContactDetailsId')
    table.string('Reference', 10).notNullable().index()
    table.integer('EligibilityId').unsigned().notNullable()
    table.string('EmailAddress', 100).notNullable()
    table.string('PhoneNumber', 100)
    table.dateTime('DateSubmitted').notNullable()
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('UpdateContactDetails')
}
