exports.up = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.string('PaymentMethod', 10)
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Claim', function (table) {
    table.dropColumn('PaymentMethod')
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
