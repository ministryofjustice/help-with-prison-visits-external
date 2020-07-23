exports.up = function (knex, Promise) {
  return knex.schema.createTable('ClaimDocument', function (table) {
    table.increments('ClaimDocumentId')
    table.integer('EligibilityId').unsigned().notNullable()
    table.string('Reference', 10).notNullable().index()
    table.integer('ClaimId').unsigned().notNullable()
    table.string('DocumentType', 20).notNullable()
    table.integer('ClaimExpenseId').unsigned()
    table.string('DocumentStatus', 20).notNullable()
    table.string('Filepath', 250)
    table.dateTime('DateSubmitted')
    table.boolean('IsEnabled')
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('ClaimDocument')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
