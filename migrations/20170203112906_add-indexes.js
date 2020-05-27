exports.up = function (knex, Promise) {
  // Add indexes based on Azure SQL insights performance recommendations from performance test run
  return knex.schema.table('Visitor', function (table) {
    table.index('EligibilityId')
  })
    .then(function () {
      return knex.schema.table('ClaimDocument', function (table) {
        table.index(['ClaimId', 'IsEnabled', 'ClaimExpenseId'])
      })
    })
    .then(function () {
      return knex.schema.table('Claim', function (table) {
        table.index(['EligibilityId', 'ClaimId'])
      })
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('Visitor', function (table) {
    table.dropIndex('EligibilityId')
  })
    .then(function () {
      return knex.schema.table('ClaimDocument', function (table) {
        table.dropIndex(['ClaimId', 'IsEnabled', 'ClaimExpenseId'])
      })
    })
    .then(function () {
      return knex.schema.table('Claim', function (table) {
        table.dropIndex(['EligibilityId', 'ClaimId'])
      })
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
