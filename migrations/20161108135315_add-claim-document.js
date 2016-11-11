exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimDocument', function (table) {
    table.increments('ClaimDocumentId')
    table.integer('ClaimId').notNullable().references('Claim.ClaimId')
    table.string('DocumentType', 20).notNullable()
    table.integer('ClaimExpenseId').references('ClaimExpense.ClaimExpenseId')
    table.string('DocumentStatus', 20).notNullable()
    table.string('Filepath', 250)
    table.dateTime('DateSubmitted')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('ClaimDocument')
}
