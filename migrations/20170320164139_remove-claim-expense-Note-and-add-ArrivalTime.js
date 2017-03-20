exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.string('ArrivalTime', 100)
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.dropColumn('ArrivalTime')
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}
