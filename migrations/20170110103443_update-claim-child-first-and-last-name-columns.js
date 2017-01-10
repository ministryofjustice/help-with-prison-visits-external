exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimChild', function (table) {
    table.dropColumn('Name')
    table.string('FirstName', 50).notNullable()
    table.string('LastName', 50).notNullable()
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimChild', function (table) {
    table.dropColumn('FirstName')
    table.dropColumn('LastName')
    table.string('Name', 100).notNullable()
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}
