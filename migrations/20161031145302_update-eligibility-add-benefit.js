exports.up = function (knex, Promise) {
  return knex.schema.table('Eligibility', function (table) {
    table.string('Benefit', 100)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Eligibility', function (table) {
    table.dropColumn('Benefit')
  })
}
