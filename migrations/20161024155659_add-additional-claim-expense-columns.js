exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.string('Description', 100)
    table.integer('NumberOfNights')
    table.boolean('AwayOverFiveHours')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.dropColumn('Description')
    table.dropColumn('NumberOfNights')
    table.dropColumn('AwayOverFiveHours')
  })
}
