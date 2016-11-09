exports.up = function(knex, Promise) {
  return knex.schema.createTable('Child', function (table) {
    table.increments('ChildId')
    table.integer('ClaimId').notNullable().references('Claim.ClaimId')
    table.string('Name', 100).notNullable()
    table.dateTime('DateOfBirth').notNullable()
    table.string('Relationship', 100).notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Child')
}
