exports.up = function (knex, Promise) {
  return knex.schema.createTable('Visitor', function (table) {
    table.string('Reference', 10).primary().references('Eligibility.Reference')
    table.string('Title', 10).notNullable()
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
    table.string('JourneyAssistance', 10).notNullable()
    table.boolean('RequireBenefitUpload', 10).notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('Visitor')
}
