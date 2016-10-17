exports.up = function (knex, Promise) {
  return knex.schema.createTable('Eligibility', function (table) {
    table.string('Reference', 10).primary()
    table.dateTime('DateCreated').notNullable()
    table.dateTime('DateSubmitted').notNullable()
    table.string('Status', 10).notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('Eligibility')
}
