exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.string('DepartureTime', 500)
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.dropColumn('DepartureTime')
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}
