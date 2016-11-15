exports.up = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.string('AssistedDigitalCaseworkerEmail', 100)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.dropColumn('AssistedDigitalCaseworkerEmail')
  })
}
