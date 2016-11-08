exports.up = function (knex, Promise) {
  return knex.schema.table('Visitor', function (table) {
    table.dropColumn('JourneyAssistance')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Visitor', function (table) {
    table.string('JourneyAssistance', 10).defaultTo('no').notNullable()
  })
}
