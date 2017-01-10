exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimChild', function (table) {
    table.increments('ClaimChildId')
    table.integer('EligibilityId').unsigned().notNullable()
    table.string('Reference', 10).notNullable().index()
    table.integer('ClaimId').unsigned().notNullable()
    table.string('Name', 100).notNullable()
    table.dateTime('DateOfBirth').notNullable()
    table.string('Relationship', 100).notNullable()
    table.boolean('IsEnabled')
  })
  .then(function () {
    return knex.schema.alterTable('ClaimChild', function (table) {
      table
        .foreign(['ClaimId', 'EligibilityId', 'Reference'])
        .references(['Claim.ClaimId', 'Claim.EligibilityId', 'Claim.Reference'])
    })
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
