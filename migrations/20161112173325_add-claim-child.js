exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimChild', function (table) {
    table.increments('ClaimChildId')
    table.integer('EligibilityId').unsigned().notNullable().references('Claim.EligibilityId') // REMOVED FOREIGN KEY IN LATER MIGRATION
    table.string('Reference', 10).notNullable().index().references('Claim.Reference') // REMOVED FOREIGN KEY IN LATER MIGRATION
    table.integer('ClaimId').unsigned().notNullable().references('Claim.ClaimId')
    table.string('FirstName', 50).notNullable()
    table.string('LastName', 50).notNullable()
    table.dateTime('DateOfBirth').notNullable()
    table.string('Relationship', 100).notNullable()
    table.boolean('IsEnabled')
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('ClaimChild')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
