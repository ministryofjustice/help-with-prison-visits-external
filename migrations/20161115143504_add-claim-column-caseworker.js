exports.up = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.string('AssistedDigitalCaseworker', 100)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.dropColumn('AssistedDigitalCaseworker')
  })
}
