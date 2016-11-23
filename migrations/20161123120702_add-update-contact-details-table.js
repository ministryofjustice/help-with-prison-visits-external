exports.up = function (knex, Promise) {
  return knex.schema.createTable('UpdateContactDetails', function (table) {
    table.string('Reference', 10).primary().index()
    table.string('EmailAddress', 100).notNullable()
    table.string('PhoneNumber', 100)
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('UpdateContactDetails')
}
