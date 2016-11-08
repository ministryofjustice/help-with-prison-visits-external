exports.up = function (knex, Promise) {
  return knex.schema.table('Visitor', function (table) {
    table.dropColumn('RequireBenefitUpload')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Visitor', function (table) {
    table.boolean('RequireBenefitUpload')
  })
}
