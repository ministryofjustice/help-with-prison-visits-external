exports.up = function (knex, Promise) {
  return knex.schema.createTable('Claim', function (table) {
    table.increments('ClaimId')
    table.string('Reference', 10).notNullable().references('Eligibility.Reference')
    table.dateTime('DateOfJourney').notNullable()
    table.dateTime('DateCreated').notNullable()
    table.dateTime('DateSubmitted')
    table.string('Status', 20).notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('Claim')
}
