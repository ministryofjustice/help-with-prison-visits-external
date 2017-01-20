exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimExpense', function (table) {
    table.increments('ClaimExpenseId')
    table.integer('EligibilityId').unsigned().notNullable().references('Claim.EligibilityId') // REMOVED FOREIGN KEY IN LATER MIGRATION
    table.string('Reference', 10).notNullable().index().references('Claim.Reference') // REMOVED FOREIGN KEY IN LATER MIGRATION
    table.integer('ClaimId').unsigned().notNullable().references('Claim.ClaimId')
    table.string('ExpenseType', 100).notNullable()
    table.decimal('Cost').notNullable()
    table.string('TravelTime', 100)
    table.string('From', 100)
    table.string('To', 100)
    table.boolean('IsReturn')
    table.integer('DurationOfTravel')
    table.string('TicketType', 100)
    table.string('TicketOwner', 10)
    table.boolean('IsEnabled')
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('ClaimExpense')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
