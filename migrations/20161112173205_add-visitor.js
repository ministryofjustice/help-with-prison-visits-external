exports.up = function (knex, Promise) {
  return knex.schema.createTable('Visitor', function (table) {
    table.increments('VisitorId')
    table.integer('EligibilityId').unsigned().notNullable().references('Eligibility.EligibilityId')
    table.string('Reference', 10).notNullable().index().references('Eligibility.Reference')
    table.string('FirstName', 100).notNullable()
    table.string('LastName', 100).notNullable()
    table.string('NationalInsuranceNumber', 10).notNullable()
    table.string('HouseNumberAndStreet', 250).notNullable()
    table.string('Town', 100).notNullable()
    table.string('County', 100).notNullable()
    table.string('PostCode', 10).notNullable()
    table.string('Country', 100).notNullable()
    table.string('EmailAddress', 100).notNullable()
    table.string('PhoneNumber', 100)
    table.dateTime('DateOfBirth').notNullable()
    table.string('Relationship', 100).notNullable()
    table.string('Benefit', 100)
  })
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('Visitor')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
