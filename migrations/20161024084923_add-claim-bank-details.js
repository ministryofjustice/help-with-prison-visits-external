exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimBankDetail', function (table) {
    table.increments('ClaimBankDetailId')
    table.integer('ClaimId').notNullable().references('Claim.ClaimId')
    table.string('AccountNumber', 8)
    table.string('SortCode', 6)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('ClaimBankDetail')
}
