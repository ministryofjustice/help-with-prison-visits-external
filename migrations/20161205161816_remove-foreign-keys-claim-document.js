exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimDocument', function (table) {
    table.dropForeign('ClaimId')
    table.dropForeign('ClaimExpenseId')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('ClaimDocument', function (table) {
    table.foreign('ClaimId').references('Claim.ClaimId')
    table.foreign('ClaimExpenseId').references('ClaimExpense.ClaimExpenseId')
  })
}
