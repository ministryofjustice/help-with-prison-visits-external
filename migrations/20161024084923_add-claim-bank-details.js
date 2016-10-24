exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimBankDetail', function (table) {
    table.increments('ClaimBankDetailId')
    table.integer('ClaimId').notNullable().references('Claim.ClaimId')
    table.integer('AccountNumber')
    table.integer('SortCode')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('ClaimBankDetail')
}
