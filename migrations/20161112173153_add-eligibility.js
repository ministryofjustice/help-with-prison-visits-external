exports.up = function (knex, Promise) {
  return knex.schema.createTable('Eligibility', function (table) {
    table.increments('EligibilityId')
    table.string('Reference', 10).notNullable().index()
    table.dateTime('DateCreated').notNullable()
    table.dateTime('DateSubmitted')
    table.string('Status', 20).notNullable()
  })
  .then(function () {
    return knex.schema.alterTable('Eligibility', function (table) {
      table.unique(['EligibilityId', 'Reference'])
    })
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
