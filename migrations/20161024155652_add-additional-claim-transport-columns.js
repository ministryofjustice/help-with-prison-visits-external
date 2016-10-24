exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimTransport', function (table) {
    table.integer('NumberOfDays')
    table.string('TicketType', 100)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimTransport', function (table) {
    table.dropColumn('NumberOfDays')
    table.dropColumn('TicketType')
  })
}
