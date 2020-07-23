exports.up = function (knex, Promise) {
  return knex.schema.createTable('Claim', function (table) {
    table.increments('ClaimId').unique()
    table.integer('EligibilityId').unsigned().notNullable().unique() // NO FOREIGN KEY FOR REPEAT CLAIMS WHEN NO ELIGIBILITY IN EXTSCHEMA
    table.string('Reference', 10).notNullable().index().unique() // NO FOREIGN KEY FOR REPEAT CLAIMS WHEN NO ELIGIBILITY IN EXTSCHEMA
    table.string('AssistedDigitalCaseworker', 100)
    table.string('ClaimType', 50)
    table.string('Status', 20).notNullable()
    table.boolean('IsAdvanceClaim')
    table.dateTime('DateOfJourney').notNullable()
    table.dateTime('DateCreated').notNullable()
    table.dateTime('DateSubmitted')
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('Claim')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
