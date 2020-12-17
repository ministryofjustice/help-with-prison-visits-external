exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.string('ReturnTime', 100)
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.dropColumn('ReturnTime')
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
