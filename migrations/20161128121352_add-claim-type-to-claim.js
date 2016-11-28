exports.up = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.string('ClaimType', 50)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.dropColumn('ClaimType')
  })
}
