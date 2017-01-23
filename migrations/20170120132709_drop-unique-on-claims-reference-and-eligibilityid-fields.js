exports.up = function (knex, Promise) {
  return knex.schema.table('ClaimEscort', function (table) {
    table.dropForeign('Reference')
    table.dropForeign('EligibilityId')
  })
  .then(function () {
    return knex.schema.table('ClaimChild', function (table) {
      table.dropForeign('Reference')
      table.dropForeign('EligibilityId')
    })
  })
  .then(function () {
    return knex.schema.table('ClaimExpense', function (table) {
      table.dropForeign('Reference')
      table.dropForeign('EligibilityId')
    })
  })
  .then(function () {
    return knex.schema.table('Claim', function (table) {
      table.dropUnique('Reference')
      table.dropUnique('EligibilityId')
    })
  })
  .catch(function (error) {
    console.log(error)
    throw error
  })
}

exports.down = function (knex, Promise) {
  return knex.raw('ALTER TABLE Claim ADD CONSTRAINT claim_reference_unique UNIQUE NONCLUSTERED (Reference)')
    .then(function () {
      return knex.raw('ALTER TABLE Claim ADD CONSTRAINT claim_eligibilityid_unique UNIQUE NONCLUSTERED (EligibilityId)')
    })
    .then(function () {
      return knex.schema.table('ClaimChild', function (table) {
        table.foreign('Reference').references('Claim.Reference')
        table.foreign('EligibilityId').references('Claim.EligibilityId')
      })
    })
    .then(function () {
      return knex.schema.table('ClaimExpense', function (table) {
        table.foreign('Reference').references('Claim.Reference')
        table.foreign('EligibilityId').references('Claim.EligibilityId')
      })
    })
    .then(function () {
      return knex.schema.table('ClaimEscort', function (table) {
        table.foreign('Reference').references('Claim.Reference')
        table.foreign('EligibilityId').references('Claim.EligibilityId')
      })
    })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
