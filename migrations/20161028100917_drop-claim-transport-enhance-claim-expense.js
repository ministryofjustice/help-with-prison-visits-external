exports.up = function (knex, Promise) {
  return knex.schema.dropTable('ClaimTransport').then(function () {
    return knex.schema.table('ClaimExpense', function (table) {
      table.dropColumn('Description')
      table.dropColumn('NumberOfNights')
      table.string('From', 100)
      table.string('To', 100)
      table.boolean('IsReturn')
      table.integer('DurationOfTravel')
      table.string('TicketType', 100)
    })
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.createTable('ClaimTransport', function (table) {
    table.increments('ClaimTransportId')
    table.integer('ClaimId').notNullable().references('Claim.ClaimId')
    table.string('TransportType', 100).notNullable()
    table.string('From', 100).notNullable()
    table.string('To', 100).notNullable()
    table.integer('NumberOfDays')
    table.string('TicketType', 100)
    table.boolean('IsReturn')
    table.decimal('Cost').notNullable()
    table.boolean('IsEnabled').notNullable().defaultTo(true)
  }).then(function () {
    return knex.schema.table('ClaimExpense', function (table) {
      table.string('Description', 100)
      table.integer('NumberOfNights')

      table.dropColumn('From')
      table.dropColumn('To')
      table.dropColumn('IsReturn')
      table.dropColumn('DurationOfTravel')
      table.dropColumn('TicketType')
    })
  })
}
