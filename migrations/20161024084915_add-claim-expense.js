exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimExpense', function (table) {
    table.increments('ClaimExpenseId')
    table.integer('ClaimId').notNullable().references('Claim.ClaimId')
    table.string('ExpenseType', 100).notNullable()
    table.decimal('Cost').notNullable()
    table.boolean('IsEnabled').notNullable().defaultTo(true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('ClaimExpense')
}
