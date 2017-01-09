exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimEscort', function (table) {
    table.increments('ClaimEscortId')
    table.integer('EligibilityId').unsigned().notNullable()
    table.string('Reference', 10).notNullable().index()
    table.integer('ClaimId').unsigned().notNullable()
    table.string('FirstName', 100).notNullable()
    table.string('LastName', 100).notNullable()
    table.dateTime('DateOfBirth').notNullable()
    table.string('NationalInsuranceNumber', 10).notNullable()
    table.boolean('IsEnabled')
  })
    .then(function () {
      return knex.schema.alterTable('ClaimEscort', function (table) {
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
  return knex.schema.dropTable('ClaimEscort')
}
