exports.up = function (knex, Promise) {
  return knex.schema.createTable('Eligibility', function (table) {
    table.increments('EligibilityId').unique()
    table.string('Reference', 10).notNullable().index().unique()
    table.dateTime('DateCreated').notNullable()
    table.dateTime('DateSubmitted')
    table.string('Status', 20).notNullable()
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('Eligibility')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
