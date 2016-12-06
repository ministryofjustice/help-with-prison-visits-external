exports.up = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.boolean('IsAdvanceClaim')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.dropColumn('IsAdvanceClaim')
  })
}
