exports.up = function (knex, Promise) {
  return knex.schema.createTable('Task', function (table) {
    table.increments('TaskId')
    table.string('Task', 100).notNullable()
    table.string('Reference', 10) // No foreign key as task may remove records.
    table.integer('EligibilityId') // No foreign key as task may remove records.
    table.integer('ClaimId') // No foreign key as task may remove records.
    table.text('AdditionalData', 1300)
    table.dateTime('DateCreated').notNullable()
    table.dateTime('DateProcessed')
    table.string('Status', 20).notNullable()
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('Task')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
