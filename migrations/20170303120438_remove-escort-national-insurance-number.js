exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimEscort', function (table) {
    table.dropColumn('NationalInsuranceNumber')
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimEscort', function (table) {
    table.string('NationalInsuranceNumber', 10)
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
