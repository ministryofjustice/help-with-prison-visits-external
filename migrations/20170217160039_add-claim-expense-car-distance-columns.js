exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.string('FromPostCode', 10)
    table.string('ToPostCode', 10)
    table.decimal('Distance')
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimExpense', function (table) {
    table.dropColumn('FromPostCode')
    table.dropColumn('ToPostCode')
    table.dropColumn('Distance')
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
