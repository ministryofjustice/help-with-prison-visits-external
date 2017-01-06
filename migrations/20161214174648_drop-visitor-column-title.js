exports.up = function (knex, Promise) {
  return knex.schema.table('Visitor', function (table) {
    table.dropColumn('Title')
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Visitor', function (table) {
    table.string('Title', 10).notNullable()
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}
