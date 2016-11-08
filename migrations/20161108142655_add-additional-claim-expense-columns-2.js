/**
 * Note that we are not defaulting the boolean here to false as doing so adds a constraint on the column which prevents
 * us from rolling it back when the down function is called.
 */
exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.boolean('IsChild')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.dropColumn('IsChild')
  })
}
