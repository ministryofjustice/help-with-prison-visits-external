exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimChild', function (table) {
    table.increments('ClaimChildId')
    table.integer('ClaimId').notNullable().references('Claim.ClaimId')
    table.string('Name', 100).notNullable()
    table.dateTime('DateOfBirth').notNullable()
    table.string('Relationship', 100).notNullable()
    table.boolean('IsEnabled').notNullable().defaultTo(true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('ClaimChild')
}
